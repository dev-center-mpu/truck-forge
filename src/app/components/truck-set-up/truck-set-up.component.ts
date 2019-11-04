import {Component, OnDestroy, OnInit} from '@angular/core';
import {DocumentChangedEvent, ThumbnailOptions, ViewerInitializedEvent, ViewerOptions} from 'ng2-adsk-forge-viewer';
import {ServerForgeConnectionService} from '../../services/server-forge-connection.service';
import {ChosenDataService} from '../../services/chosen-data.service';
import Cargo from '../../interfaces/cargo';

declare const THREE: any;

interface ViewerPallet {
  id: number;
  crate: Cargo;
}

@Component({
  selector: 'app-truck-set-up',
  templateUrl: './truck-set-up.component.html',
  styleUrls: ['./truck-set-up.component.scss']
})
export class TruckSetUpComponent implements OnInit, OnDestroy {

  viewer;

  viewerOptions3d: ViewerOptions;
  thumbnailOptions: ThumbnailOptions;

  pallets: Array<ViewerPallet[]>;

  constructor(
    private serverForgeConnection: ServerForgeConnectionService,
    private chosenData: ChosenDataService
  ) {
    this.pallets = [];
  }

  async ngOnInit() {
    const authData = await this.serverForgeConnection.getData();
    const token = authData.access_token;
    const documentUrn = this.chosenData.truck.urn;

    this.thumbnailOptions = {
      getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
        const expireTimeSeconds = 60 * 30 * 1000;
        onGetAccessToken(token, expireTimeSeconds);
      },
      documentId: documentUrn,
      width: 400,
      height: 400,
    };

    this.viewerOptions3d = {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(token, expireTimeSeconds);
        },
      },
      onViewerInitialized: (args: ViewerInitializedEvent) => {
        args.viewerComponent.DocumentId = documentUrn;
        this.viewer = args.viewer;
        this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.addCrateOnScene.bind(this));
        this.initViewer(args.viewer);
      },
    };
  }

  ngOnDestroy() {
    this.viewer = undefined;
    this.viewerOptions3d = undefined;
    this.thumbnailOptions = undefined;
    this.pallets = undefined;
  }

  documentChanged(event: DocumentChangedEvent) {
    const {document} = event;

    if (!document.getRoot()) {
      return;
    }

    const viewables = document.getRoot().search({type: 'geometry', role: '2d'});
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]).then();
    }
  }

  initViewer(viewer) {
    viewer.overlays.impl.invalidate(true);
    this.viewer = viewer;
    this.viewer.impl.createOverlayScene('cScene');

    const pallets = [];
    for (const array of this.chosenData.truck.palletsId) {
      const palletsLine = [];
      for (const value of array) {
        palletsLine.push({id: value, crate: undefined});
      }
      pallets.push(palletsLine);
    }
    this.pallets = pallets;
  }

  addCrateOnScene() {
    const crate = this.chosenData.crate;
    if (crate === undefined) {
      return;
    }

    let id: number;
    loop: for (const palletsLine of this.pallets) {
      for (const pallet of palletsLine) {
        const partId = this.viewer.getSelection()[0];
        if (partId === pallet.id) {
          if (pallet.crate !== undefined) {
            return;
          } else {
            id = partId;
            pallet.crate = crate;
            break loop;
          }
        }
      }
    }

    if (id !== undefined) {
      const sphereMesh = [];
      const inMass1 = [];
      const inMass2 = [];
      sphereMesh[1] = inMass1;
      sphereMesh[2] = inMass2;

      const palletHeight = this.chosenData.pallet.height;

      const rotatedNodeId = id;
      const rotatedBody = {nodeId: rotatedNodeId, fragId: null, fragProxy: null, worldMatrix: null, position: null};
      rotatedBody.fragId = this.viewer.impl.model.getData().fragments.fragId2dbId.indexOf(rotatedNodeId);

      rotatedBody.fragProxy = this.viewer.impl.getFragmentProxy(this.viewer.impl.model, rotatedBody.fragId);
      rotatedBody.fragProxy.getAnimTransform();

      rotatedBody.worldMatrix = new THREE.Matrix4();
      rotatedBody.fragProxy.getWorldMatrix(rotatedBody.worldMatrix);

      // Центр выбранной детали
      rotatedBody.position = new THREE.Vector3();
      rotatedBody.position.copy(rotatedBody.worldMatrix.getPosition().clone());

      const geom = new THREE.BoxGeometry(this.chosenData.crate.width, this.chosenData.crate.height, this.chosenData.crate.length);

      const loader = new THREE.TextureLoader();
      loader.load(
        '../../../assets/crate.gif', // src
        texture => { // onSuccess
          const material = new THREE.MeshBasicMaterial({map: texture});
          sphereMesh[0] = new THREE.Mesh(geom, material);
          sphereMesh[0].position.set(rotatedBody.position.x, rotatedBody.position.y + palletHeight, rotatedBody.position.z);
          this.viewer.impl.addOverlay('cScene', sphereMesh[0]);

          this.viewer.overlays.impl.invalidate(true);
        },
        undefined, // onProcess (not supported anyway)
        err => console.log(err) // onError
      );
    }
  }
}
