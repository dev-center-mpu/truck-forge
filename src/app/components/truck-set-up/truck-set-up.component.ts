import {
  ViewerInitializedEvent,
  ViewerOptions,
  ThumbnailOptions,
  SelectionChangedEventArgs,
  DocumentChangedEvent
} from 'ng2-adsk-forge-viewer';
import * as LMV from '../../../assets/viewer_v7.min.js';
import { ACCESS_TOKEN, DOCUMENT_URN } from './config';

import {Component, OnInit} from '@angular/core';
// import * as THREE from 'three';
declare const THREE: any
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

  constructor() {
    
  }

  ngOnInit() {
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
        // console.log(args.viewer.overlays);
        this.addCustomGeom(args.viewer);
      },
    };

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
    // var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    // var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // var sphereMesh = new THREE.Mesh(geometry, material);
    // sphereMesh.position.set(1, 2, 3);


    // // if (!Viewer.overlays.hasScene('custom-scene')) {
    // //   Viewer.addScene('custom-scene');
    // // }
    // //viewer.overlays.addScene('custom-scene');
    // viewer.overlays.impl.addModel(sphereMesh);

    // const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    // const material = new THREE.MeshBasicMaterial({ color: 0x336699 });
    // const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.x = 0.0; mesh.position.y = 0.0; mesh.position.z = 0.0;
    // // Add scene and mesh
    // var scene = new THREE.Scene();
    // viewer.overlays.addScene(scene);

    // viewer.overlays.impl.scene.children.push(scene);
    // // viewer.overlays.addMesh([mesh], scene);
    // console.log(viewer.overlays);

    const geom = new THREE.SphereGeometry(10, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphereMesh = new THREE.Mesh(geom, material);
    sphereMesh.position.set(1, 2, 3);
    viewer.overlays.impl.createOverlayScene('custom-scene');
    viewer.overlays.impl.addOverlay('custom-scene', sphereMesh);
    viewer.overlays.impl.invalidate(true);
  }
}
