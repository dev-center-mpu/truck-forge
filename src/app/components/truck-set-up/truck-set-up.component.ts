import {
  ViewerInitializedEvent,
  ViewerOptions,
  ThumbnailOptions,
  SelectionChangedEventArgs,
  DocumentChangedEvent
} from 'ng2-adsk-forge-viewer';
import { ACCESS_TOKEN, DOCUMENT_URN } from './config';

import {Component, OnInit} from '@angular/core';
// import * as THREE from 'three';
declare const THREE: any;
import * as projector from "three/examples/js/renderers/Projector.js"
import { from } from 'rxjs';

@Component({
  selector: 'app-truck-set-up',
  templateUrl: './truck-set-up.component.html',
  styleUrls: ['./truck-set-up.component.scss']
})
export class TruckSetUpComponent implements OnInit {

  public viewerOptions3d: ViewerOptions;
  public thumbnailOptions: ThumbnailOptions;
  public documentId: string;
  
  viewer;
  
  raycaster; mouse; INTERSECTED;

  constructor() {
    this.thumbnailOptions = {
      getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
        const expireTimeSeconds = 60 * 30 * 1000;
        onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
      },
      documentId: DOCUMENT_URN,
      width: 400,
      height: 400,
    };

    this.viewerOptions3d = {
      initializerOptions: {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
        },
      },
      onViewerInitialized: (args: ViewerInitializedEvent) => {
        // Load document in the viewer
        args.viewerComponent.DocumentId = DOCUMENT_URN;
        // this.mouse = new THREE.Vector2(1, 1);
        
        this.viewer = args.viewer;
        console.log(this.viewer);
        document.querySelector("#forge").addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        this.addCustomGeom(args.viewer);
      },
    };

  }

  ngOnInit() {
    // this.thumbnailOptions = {
    //   getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
    //     const expireTimeSeconds = 60 * 30 * 1000;
    //     onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
    //   },
    //   documentId: DOCUMENT_URN,
    //   width: 400,
    //   height: 400,
    // };

    // this.viewerOptions3d = {
    //   initializerOptions: {
    //     env: 'AutodeskProduction',
    //     getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
    //       const expireTimeSeconds = 60 * 30;
    //       onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
    //     },
    //   },
    //   onViewerInitialized: (args: ViewerInitializedEvent) => {
    //     // Load document in the viewer
    //     args.viewerComponent.DocumentId = DOCUMENT_URN;
    //     // this.mouse = new THREE.Vector2(1, 1);
        
    //     this.viewer = args.viewer;
    //     console.log(this.viewer);
    //     document.querySelector("#forge").addEventListener('mousemove', this.onDocumentMouseMove, false);
    //     this.addCustomGeom(args.viewer);
    //   },
    // };

  }

  public documentChanged(event: DocumentChangedEvent) {
    const { document } = event;
  
    if (!document.getRoot()) return;
  
    const viewables = document.getRoot().search({ type: 'geometry', role: '2d' });
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }


  addCustomGeom(viewer){
    const geom = new THREE.BoxGeometry( 20, 1, 20 );
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphereMesh = new THREE.Mesh(geom, material);
    sphereMesh.position.set(100, 2, 3);
    viewer.impl.createOverlayScene('cScene');
    viewer.impl.addOverlay('cScene', sphereMesh);
    viewer.overlays.impl.invalidate(true);

    this.viewer = viewer;
  }

  onDocumentMouseMove(event){
    this.mouse = new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);

    console.log(this.viewer);

    var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
    vector.unproject(this.viewer.impl.camera);
    
    this.raycaster = new THREE.Raycaster(this.viewer.impl.camera.position, vector.sub(this.viewer.impl.camera.position).normalize());

    var intersects = this.raycaster.intersectObjects( this.viewer.impl.overlayScenes.cScene.scene.children );
    console.log(intersects.length);
    // if there is one (or more) intersections
    if ( intersects.length > 0 )
    {
      // if the closest object intersected is not the currently stored intersection object
      if ( intersects[ 0 ].object != this.INTERSECTED )
      {
        // restore previous intersection object (if it exists) to its original color
        if ( this.INTERSECTED )
        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        // store reference to closest object as current intersection object
        this.INTERSECTED = intersects[ 0 ].object;
        // store color of closest object (for later restoration)
        this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
        // set a new color for closest object
        this.INTERSECTED.material.color.setHex( 0x080708 );
      }
    }
    else // there are no intersections
    {
      // restore previous intersection object (if it exists) to its original color
      if ( this.INTERSECTED )
        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        this.INTERSECTED = null;
    } 
  }
}
