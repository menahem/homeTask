┌─────────────────┐         HTTPS/TLS          ┌─────────────────┐
│                 │◄───────────────────────────►│                 │
│  React Client   │    Long-polling for msgs    │  Node.js Server │
│                 │◄───────────────────────────►│                 │
└─────────────────┘                             └────────┬────────┘
                                                         │
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ SQLite Database │
                                                │ (Encrypted)     │
                                                └─────────────────┘

1. Download HomeTask project from git.
2. Enter to backend folder and execute below: 
    - npm install
    - npm run build
    - npm run dev
3. Enter to frontend folder from another cmd and execute below: 
    - npm install
    - npm run build
    - npm run dev

For unit test run: npm test on from the backend folder path

Enjoy!


<img width="512" height="610" alt="image" src="https://github.com/user-attachments/assets/110cf86e-f0dd-4a23-98ff-c0c0e516e05d" />
![20251201-1022-01 5812317](https://github.com/user-attachments/assets/d6c254f7-1dd6-4b36-b6ff-768fb9e0a979)
