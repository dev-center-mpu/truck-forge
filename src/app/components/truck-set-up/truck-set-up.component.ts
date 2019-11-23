import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentChangedEvent, ThumbnailOptions, ViewerInitializedEvent, ViewerOptions } from 'ng2-adsk-forge-viewer';
import { ServerForgeConnectionService } from '../../services/server-forge-connection.service';
import { ChosenDataService } from '../../services/chosen-data.service';

declare const THREE: any;

@Component({
  selector: 'app-truck-set-up',
  templateUrl: './truck-set-up.component.html',
  styleUrls: ['./truck-set-up.component.scss']
})
export class TruckSetUpComponent implements OnInit, OnDestroy {

  viewer;

  viewerOptions3d: ViewerOptions;
  thumbnailOptions: ThumbnailOptions;

  raycaster;
  mouse;
  INTERSECTED;
  intersects;

  constructor(
    private serverForgeConnection: ServerForgeConnectionService,
    private chosenData: ChosenDataService
  ) {
    this.chosenData.pallets = [];
    this.chosenData.cargo.map((crate, index) => {
      crate.id = index;
    });
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
        document.querySelector('#forge').addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.querySelector('#forge').addEventListener('click', this.onCargoClick.bind(this), false);
        this.initViewer(args.viewer);
      },
    };
  }

  ngOnDestroy() {
    this.viewer = undefined;
    this.viewerOptions3d = undefined;
    this.thumbnailOptions = undefined;
    this.chosenData.pallets = undefined;
    this.chosenData.cargo.map(crate => {
      crate.id = undefined;
    });
  }

  documentChanged(event: DocumentChangedEvent) {
    const { document } = event;

    if (!document.getRoot()) {
      return;
    }

    const viewables = document.getRoot().search({ type: 'geometry', role: '2d' });
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
        palletsLine.push({ id: value, crate: undefined });
      }
      pallets.push(palletsLine);
    }
    this.chosenData.pallets = pallets;

    this.viewer.impl.onLoadComplete = () => viewer.toolbar.container.hidden = true;
  }

  addCrateOnScene(event) {
    console.log(this.viewer.getSelection()[0]);
    const crate = this.chosenData.crate;
    if (crate === undefined) {
      return;
    }

    let id: number;
    loop: for (const palletsLine of this.chosenData.pallets) {
      for (const pallet of palletsLine) {
        const partId = this.viewer.getSelection()[0];
        if (partId === pallet.id) {
          if (pallet.crate !== undefined) {
            pallet.crate = undefined;
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

      const crateHeight = this.chosenData.crate.height;

      const rotatedNodeId = id;
      const rotatedBody = { nodeId: rotatedNodeId, fragId: null, fragProxy: null, worldMatrix: null, position: null };
      rotatedBody.fragId = this.viewer.impl.model.getData().fragments.fragId2dbId.indexOf(rotatedNodeId);

      rotatedBody.fragProxy = this.viewer.impl.getFragmentProxy(this.viewer.impl.model, rotatedBody.fragId);
      rotatedBody.fragProxy.getAnimTransform();

      rotatedBody.worldMatrix = new THREE.Matrix4();
      rotatedBody.fragProxy.getWorldMatrix(rotatedBody.worldMatrix);

      // Центр выбранной детали
      rotatedBody.position = new THREE.Vector3();
      rotatedBody.position.copy(rotatedBody.worldMatrix.getPosition().clone());

      const geom = new THREE.BoxGeometry(this.chosenData.crate.width, this.chosenData.crate.height, this.chosenData.crate.length);
      geom.userData = crate;
      this.chosenData.crate = undefined;

      const loader = new THREE.TextureLoader();
      loader.load(
        '../../../assets/crate.gif', // src
        texture => { // onSuccess
          const material = new THREE.MeshBasicMaterial({ map: texture });
          material.opacity = 0.5;
          sphereMesh[0] = new THREE.Mesh(geom, material);
          sphereMesh[0].position.set(
            rotatedBody.position.x,
            rotatedBody.position.y + palletHeight / 2 + crateHeight / 2,
            rotatedBody.position.z
          );
          this.viewer.impl.addOverlay('cScene', sphereMesh[0]);
          this.viewer.impl.invalidate(true);
        },
        undefined, // onProcess (not supported anyway)
        err => console.log(err) // onError
      );
    }
  }

  onDocumentMouseMove(event) {
    this.mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
    vector.unproject(this.viewer.impl.camera);

    this.raycaster = new THREE.Raycaster(this.viewer.impl.camera.position, vector.sub(this.viewer.impl.camera.position).normalize());

    this.intersects = this.raycaster.intersectObjects(this.viewer.impl.overlayScenes.cScene.scene.children);
    if (this.intersects.length > 0) {
      // if the closest object intersected is not the currently stored intersection object
      if (this.intersects[0].object !== this.INTERSECTED) {
        // restore previous intersection object (if it exists) to its original color
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }
        // store reference to closest object as current intersection object
        this.INTERSECTED = this.intersects[0].object;
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

  onCargoClick() {
    if (this.intersects[0] !== undefined) {
      const crateMesh = this.intersects[0].object;
      const crate = crateMesh.geometry;

      const crateId = crate.userData.id;
      loop: for (const palletsLine of this.chosenData.pallets) {
        for (const pallet of palletsLine) {
          if (pallet.crate !== undefined && crateId === pallet.crate.id) {
            pallet.crate = undefined;
            break loop;
          }
        }
      }

      this.chosenData.addCrate(crate.userData, true);
      this.viewer.impl.removeOverlay('cScene', crateMesh);
    }
  }

  placeMassCenter(errorCenterX: number = 0, errorCenterY: number = 0, errorCenterZ: number = 0) {
    const id = this.chosenData.truck.leftWallId;
    const centerBody = { nodeId: id, fragId: null, fragProxy: null, worldMatrix: null, position: null };
    centerBody.fragId = this.viewer.impl.model.getData().fragments.fragId2dbId.indexOf(centerBody.nodeId);

    centerBody.fragProxy = this.viewer.impl.getFragmentProxy(this.viewer.impl.model, centerBody.fragId);
    centerBody.fragProxy.getAnimTransform();

    centerBody.worldMatrix = new THREE.Matrix4();
    centerBody.fragProxy.getWorldMatrix(centerBody.worldMatrix);

    // Центр выбранной детали
    centerBody.position = new THREE.Vector3();
    centerBody.position.copy(centerBody.worldMatrix.getPosition().clone());

    const geom = new THREE.SphereGeometry(100, 32, 32);
    const loader = new THREE.TextureLoader();
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh(geom, material);
    sphere.position.set(0 - errorCenterX, centerBody.position.y - errorCenterY, 
      centerBody.position.z - errorCenterZ);

    this.viewer.impl.addOverlay('cScene', sphere);

    console.log(this.viewer.impl.overlayScenes);

    this.viewer.impl.invalidate(true);
  }
}
