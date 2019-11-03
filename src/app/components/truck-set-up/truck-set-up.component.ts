import { Component, OnInit } from '@angular/core';
import { DocumentChangedEvent, ThumbnailOptions, ViewerInitializedEvent, ViewerOptions } from 'ng2-adsk-forge-viewer';
import { ServerForgeConnectionService } from '../../services/server-forge-connection.service';
import { ChosenDataService } from '../../services/chosen-data.service';

declare const THREE: any;

@Component({
  selector: 'app-truck-set-up',
  templateUrl: './truck-set-up.component.html',
  styleUrls: ['./truck-set-up.component.scss']
})
export class TruckSetUpComponent implements OnInit {

  private viewerOptions3d: ViewerOptions;
  private thumbnailOptions: ThumbnailOptions;

  public viewer;

  public raycaster;
  public mouse;
  public INTERSECTED;

  constructor(
    private serverForgeConnection: ServerForgeConnectionService,
    private chosenData: ChosenDataService) {
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
        // document.querySelector('#forge')
        // .addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onDocumentMouseClick.bind(this));
        this.addCustomGeom(args.viewer);
      },
    };
  }

  public documentChanged(event: DocumentChangedEvent) {
    const { document } = event;

    if (!document.getRoot()) {
      return;
    }

    const viewables = document.getRoot().search({ type: 'geometry', role: '2d' });
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }

  addCustomGeom(viewer) {
    viewer.overlays.impl.invalidate(true);
    this.viewer = viewer;
    this.viewer.impl.createOverlayScene('cScene');
  }

  onDocumentMouseMove(event) {
    this.mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
    vector.unproject(this.viewer.impl.camera);

    this.raycaster = new THREE.Raycaster(this.viewer.impl.camera.position, vector.sub(this.viewer.impl.camera.position).normalize());

    const intersects = this.raycaster.intersectObjects(this.viewer.impl.overlayScenes.cScene.scene.children);
    if (intersects.length > 0) {
      // if the closest object intersected is not the currently stored intersection object
      if (intersects[0].object !== this.INTERSECTED) {
        // restore previous intersection object (if it exists) to its original color
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }
        // store reference to closest object as current intersection object
        this.INTERSECTED = intersects[0].object;
        // store color of closest object (for later restoration)
        this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
        // set a new color for closest object
        this.INTERSECTED.material.color.setHex(0x080708);
      }
    } else {
      // restore previous intersection object (if it exists) to its original color
      if (this.INTERSECTED) {
        this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
      }
      // remove previous intersection object reference
      //     by setting current intersection object to "nothing"
      this.INTERSECTED = null;
    }
  }

  onDocumentMouseClick(event) {
    const sphereMesh = [];
    const inMass1 = [];
    const inMass2 = [];
    sphereMesh[1] = inMass1;
    sphereMesh[2] = inMass2;

    const palletHeight = this.chosenData.pallet.height;
    // const palletCount = this.chosenData.truck.pallets;

    let rotatedNodeId = this.viewer.getSelection()[0];
    let rotatedBody = { nodeId: rotatedNodeId, fragId: null, fragProxy: null, worldMatrix: null, position: null };
    rotatedBody.fragId = this.viewer.impl.model.getData().fragments.fragId2dbId.indexOf(rotatedNodeId);

    rotatedBody.fragProxy = this.viewer.impl.getFragmentProxy(this.viewer.impl.model, rotatedBody.fragId);
    rotatedBody.fragProxy.getAnimTransform();

    rotatedBody.worldMatrix = new THREE.Matrix4();
    rotatedBody.fragProxy.getWorldMatrix(rotatedBody.worldMatrix);

    // Центр выбранной детали
    rotatedBody.position = new THREE.Vector3();
    rotatedBody.position.copy(rotatedBody.worldMatrix.getPosition().clone());

    const geom = new THREE.BoxGeometry(this.chosenData.crate.width, this.chosenData.crate.height, this.chosenData.crate.length);
    const texture = new THREE.TextureLoader().load( "../../../assets/crate.gif" );
    const material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "../../../assets/crate.gif" ) } );
    console.log(material.map);
    sphereMesh[0] = new THREE.Mesh(geom, material);
    sphereMesh[0].position.set(rotatedBody.position.x, rotatedBody.position.y + palletHeight, rotatedBody.position.z);
    this.viewer.impl.addOverlay('cScene', sphereMesh[0]);

    this.viewer.overlays.impl.invalidate(true);
  }
}
