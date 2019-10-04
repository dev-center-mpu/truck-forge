import {
  ViewerInitializedEvent,
  ViewerOptions,
  ThumbnailOptions,
  SelectionChangedEventArgs,
  DocumentChangedEvent
} from 'ng2-adsk-forge-viewer';
import { ACCESS_TOKEN, DOCUMENT_URN } from './config';

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-truck-set-up',
  templateUrl: './truck-set-up.component.html',
  styleUrls: ['./truck-set-up.component.scss']
})
export class TruckSetUpComponent implements OnInit {

  public viewerOptions3d: ViewerOptions;
  public thumbnailOptions: ThumbnailOptions;
  public documentId: string;


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
      },
    };

  }

  // public loadDocument(args: ViewerInitializedEvent) {
  //   args.viewerComponent.DocumentId = DOCUMENT_URN;
  // }

  public documentChanged(event: DocumentChangedEvent) {
    const { document } = event;
  
    if (!document.getRoot()) return;
  
    const viewables = document.getRoot().search({ type: 'geometry', role: '2d' });
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }
}
