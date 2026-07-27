import fs from 'fs';

async function run() {
  try {
    const parserPath = '/Users/apple/.npm/_npx/668c188756b835f3/node_modules/@mermaid-js/parser/dist/mermaid-parser.esm.mjs';
    const parserModule = await import('file://' + parserPath);
    console.log('Successfully imported @mermaid-js/parser module!');
    console.log('Export keys:', Object.keys(parserModule));

    const diagrams = [
      {
        file: '16_canvas_pdf_media_workflows.md',
        id: 1,
        code: `sequenceDiagram
    autonumber
    actor User as User Stylus
    participant GH as GestureHandler (UI Thread)
    participant Worklet as RN Worklet Runtime
    participant Skia as ISkiaCanvasEngine (SkCanvas)
    participant RTree as IStrokeSpatialIndex (R-Tree)
    participant Recognizer as IHandwritingRecognizer
    participant SQLite as SQLite Vector & FTS5 DB

    User->>GH: Touch Down / Drag (x, y, pressure, tilt)
    GH->>Worklet: Execute onTouchWorklet() [UI Thread]
    Worklet->>Skia: appendPoint(StrokePoint)
    Skia->>Skia: Apply Catmull-Rom Spline Interpolation
    Skia->>Skia: Render Active Stroke to Offscreen Buffer B
    Skia-->>User: Blit Composited GPU Frame (60FPS)
    User->>GH: Touch Up / Stroke Complete
    GH->>Skia: endStroke()
    Skia->>Skia: Apply RDP Path Simplification (epsilon=0.75)
    Skia->>Skia: Bake Active Buffer B into Static Buffer A
    Skia->>RTree: insert(CanvasStroke) [Update R-Tree MBR]
    
    par Async Offline Handwriting Indexing
        Skia->>Recognizer: recognizeStrokes(StrokeVectorBlock)
        Recognizer->>Recognizer: Extract Tangent Angles & Curvature Features
        Recognizer->>Recognizer: ONNX Local Handwriting Recognition
        Recognizer-->>SQLite: Index Recognized Text Tokens in FTS5 & Vector Store
    end

    note over User, SQLite: Search Execution Workflow
    User->>Recognizer: searchHandwriting(HandwritingSearchQuery)
    Recognizer->>SQLite: Query FTS5 Text & SQLite Vec Index
    SQLite-->>Recognizer: Return Matched Stroke Group IDs & Spatial BBox
    Recognizer->>RTree: queryEnvelope(MatchedBBox)
    RTree-->>Recognizer: Return CanvasStrokes
    Recognizer-->>User: Scroll Viewport & Pulse Highlight Bounding Box`
      },
      {
        file: '16_canvas_pdf_media_workflows.md',
        id: 2,
        code: `flowchart TD
    classDef stateNode fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#f8fafc;
    classDef actionNode fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#38bdf8;
    classDef decisionNode fill:#312e81,stroke:#6366f1,stroke-width:2px,color:#e0e7ff;

    Start([PDF Document Viewport Loaded]):::stateNode --> SelectTool{User Selects Annotation Tool}:::decisionNode

    SelectTool -->|Text Highlight Tool| DragHighlight[Drag Gesture over PDF Text]:::actionNode
    SelectTool -->|Area Crop Tool| DragCrop[Draw Bounding Box over Diagram]:::actionNode
    SelectTool -->|Occlusion Mask Tool| DrawMasks[Draw Rectangles / Polygons over Key Terms]:::actionNode

    %% Text Highlight Branch
    DragHighlight --> ExtractQuads[Extract pdfjs-dist Glyph Quads]:::actionNode
    ExtractQuads --> SnapQuads[Snap Gesture to Text Line Quads]:::actionNode
    SnapQuads --> CreateHighlight[Save PdfTextHighlight & Build Deep Link URI]:::actionNode
    CreateHighlight --> HighlightDone([Text Highlight Complete]):::stateNode

    %% Area Crop Branch
    DragCrop --> RenderArea[Render High-DPI Canvas Image Slice]:::actionNode
    RenderArea --> BuildEmbedBlock[Build TipTap canvas_embed Block]:::actionNode
    BuildEmbedBlock --> EmbedDone([Embedded Block Inserted into Note]):::stateNode

    %% Image Occlusion Branch
    DrawMasks --> SelectOcclusionMode{Select Occlusion Mode}:::decisionNode
    SelectOcclusionMode -->|Hide All, Reveal One| ModeHideAll[Configure Mask Shader: Hide All]:::actionNode
    SelectOcclusionMode -->|Hide One, Reveal One| ModeHideOne[Configure Mask Shader: Hide One]:::actionNode

    ModeHideAll --> BuildFsrsCards[Instantiate FsrsImageOcclusionCard Records]:::actionNode
    ModeHideOne --> BuildFsrsCards

    BuildFsrsCards --> SaveFsrsDb[Persist Cards to SQLite FSRS Database]:::actionNode
    SaveFsrsDb --> AttachDeepLinks[Attach noteee://pdf/... Deep Link URIs]:::actionNode
    AttachDeepLinks --> OcclusionDone([FSRS Flashcards Ready for Review]):::stateNode`
      },
      {
        file: '17_app_shipping_monetization_spec.md',
        id: 1,
        code: `sequenceDiagram
    autonumber
    actor User as User / App UI
    participant Router as AIRoutingStrategyEngine
    participant RevCat as RevenueCat BillingAdapter
    participant KeyStore as EncryptedKeyStoreVault
    participant Proxy as Noteee Cloud AI Proxy
    participant ExternalAPI as Direct AI Provider (OpenAI/DeepSeek)

    User->>Router: executeAiTask(taskType, payload)
    Router->>RevCat: getEntitlementState()
    RevCat-->>Router: EntitlementState (isProActive, activeTier)

    alt User has Active Pro Subscription or 90-Day Trial
        Router->>Proxy: dispatchProAiRequest(taskType, payload, sessionToken)
        Proxy-->>Router: AI Response (OCR / Transcript / Flashcards)
        Router-->>User: Render AI Output Result
    else Pro Entitlement Expired or Inactive
        Router->>KeyStore: hasValidApiKey(provider)
        KeyStore-->>Router: boolean (hasUserKey)
        
        alt User Has Configured Valid BYOK Key
            Router->>KeyStore: getApiKey(provider)
            KeyStore-->>Router: Decrypted Key String
            Router->>ExternalAPI: POST /v1/chat/completions (Header: Bearer Key)
            ExternalAPI-->>Router: Direct API Response
            Router->>KeyStore: zeroizeMemoryBuffer()
            Router-->>User: Render AI Output Result (BYOK Tagged)
        else No BYOK Key Available
            Router->>Router: checkAvailableCredits()
            alt User Has Available Consumable Credits
                Router->>Router: deductCredits(taskType)
                Router->>Proxy: dispatchCreditAiRequest(taskType, payload)
                Proxy-->>Router: AI Response
                Router-->>User: Render AI Output Result (Credits Remaining)
            else Zero Credits Remaining
                Router-->>User: Throw QuotaExceededException (Trigger Paywall Modal)
            end
        end
    end`
      },
      {
        file: '17_app_shipping_monetization_spec.md',
        id: 2,
        code: `stateDiagram-v2
    [*] --> AnonymousUnsubscribed: Initial App Install

    state AnonymousUnsubscribed {
        [*] --> AdSupportedFreeTier
        AdSupportedFreeTier --> BYOKConfigured: User Registers API Key
        BYOKConfigured --> AdSupportedFreeTier: User Removes API Key
    }

    AnonymousUnsubscribed --> Trial90DayActive: Claim 90-Day Free Trial
    AnonymousUnsubscribed --> ProSubscribed: Purchase Pro Subscription (Monthly/Annual)
    AnonymousUnsubscribed --> LifetimeUnlocked: Purchase Lifetime Non-Consumable

    state Trial90DayActive {
        [*] --> TrialRunning
        TrialRunning --> TrialExpiringWarning: Day 83 Reached (7 Days Remaining)
        TrialExpiringWarning --> TrialRunning: User Acknowledges Notice
    }

    Trial90DayActive --> ProSubscribed: Convert to Paid Pro Subscription
    Trial90DayActive --> TrialExpired: 90 Days Elapsed (No Auto-Renew)

    state TrialExpired {
        [*] --> RestrictedFreeMode
    }

    RestrictedFreeMode --> ProSubscribed: Purchase Pro Monthly / Annual
    RestrictedFreeMode --> LifetimeUnlocked: Purchase Lifetime $149.99
    RestrictedFreeMode --> AdSupportedFreeTier: Fallback to Ad-Supported Mode

    state ProSubscribed {
        [*] --> SubscriptionActive
        SubscriptionActive --> PastDueGracePeriod: Payment Charge Failed (Store Grace)
        PastDueGracePeriod --> SubscriptionActive: Payment Method Updated & Recovered
        PastDueGracePeriod --> SubscriptionCanceled: Grace Period Expired (14 Days)
        SubscriptionActive --> SubscriptionCanceled: User Cancels Renewal
    }

    SubscriptionCanceled --> RestrictedFreeMode: Entitlement Expiration Timestamp Passed

    state LifetimeUnlocked {
        [*] --> EntitlementPermanentActive: Lifetime Entitlement Verified
    }

    LifetimeUnlocked --> [*]`
      }
    ];

    if (parserModule.parse) {
      for (const item of diagrams) {
        console.log(`\nParsing ${item.file} Diagram #${item.id} with @mermaid-js/parser...`);
        try {
          const res = await parserModule.parse(item.code);
          console.log(`✅ SUCCESS: ${item.file} Diagram #${item.id} parsed!`, res ? 'Result AST obtained' : '');
        } catch (err) {
          console.error(`❌ ERROR in ${item.file} Diagram #${item.id}:`, err.message || err);
        }
      }
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

run();
