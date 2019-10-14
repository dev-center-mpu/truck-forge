import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ViewerInitializedEvent, ViewerOptions, ThumbnailOptions, DocumentChangedEvent} from 'ng2-adsk-forge-viewer';
import {ServerForgeConnectionService} from '../../services/server-forge-connection.service';
import {ChosenDataService} from '../../services/chosen-data.service';

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

  constructor(private serverForgeConnection: ServerForgeConnectionService, private x: ChosenDataService) { 
    
  }
  async ngOnInit() {
    const serverData = this.serverForgeConnection.getData();
    const authData = isNullOrUndefined(serverData) ? {} : await serverData;
    const token = authData.access_token;
    const documentUrn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dHJ1Y2tfZm9yZ2UvMy4xLDk1LjIsMnRydWNrLnN0cA";
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
        // Load document in the viewer
        args.viewerComponent.DocumentId = documentUrn;
        // this.mouse = new THREE.Vector2(1, 1);

        this.viewer = args.viewer;
        //console.log(this.viewer);
        document.querySelector('#forge').addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        this.addCustomGeom(args.viewer);
      },
    };
  }

  public documentChanged(event: DocumentChangedEvent) {
    const {document} = event;

    if (!document.getRoot()) {
      return;
    }

    const viewables = document.getRoot().search({type: 'geometry', role: '2d'});
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }

  addCustomGeom(viewer) {
    const sphereMesh = [];
    var inMass1 = []; var inMass2 = [];
    sphereMesh[1]=inMass1;
    sphereMesh[2]=inMass2;
    const geom = new THREE.BoxGeometry(800, 145 , 1200);
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    console.log(this.x.truck);
    //@ts-ignore
    let wtruck =this.x.truck.maxWidth;
      //@ts-ignore
      console.log(this.x.truck.maxWidth);
    //@ts-ignore
    let htruck =this.x.truck.maxHeight;
      //@ts-ignore
      console.log(this.x.truck.maxHeight);
    //@ts-ignore
    let ltruck =this.x.truck.maxLength;
      //@ts-ignore
      console.log(this.x.truck.maxLength);
    //@ts-ignore
    let wpalet =this.x.pallet.width;
      //@ts-ignore
      console.log(this.x.pallet.width);
    //@ts-ignore
    let lpalet =this.x.pallet.length;
      //@ts-ignore
      console.log(this.x.pallet.length);
    console.log(wtruck);
    let j=1;
    while (ltruck>j*lpalet)
    {
      j++;
    } 
    for (var i = 0; i <= j; i++)
    {
      sphereMesh[i] = new THREE.Mesh(geom, material);
      sphereMesh[i].position.set((j-i-1)*(wpalet+200), (htruck-300)*(-1), 0);
    }
    viewer.impl.createOverlayScene('cScene');
    for (var i=0;i<= j;i++)
    {
    viewer.impl.addOverlay('cScene', sphereMesh[i]);
    console.log(i);
    }
    console.log(sphereMesh);
    viewer.overlays.impl.invalidate(true);
    this.viewer = viewer;
  }

  onDocumentMouseMove(event) {
    this.mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);


    const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
    vector.unproject(this.viewer.impl.camera);

    this.raycaster = new THREE.Raycaster(this.viewer.impl.camera.position, vector.sub(this.viewer.impl.camera.position).normalize());

    const intersects = this.raycaster.intersectObjects(this.viewer.impl.overlayScenes.cScene.scene.children);
    // if there is one (or more) intersections
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
}
