```mermaid
sequenceDiagram
    participant browser
    participant server
    
    note over browser: User writes in the form and presses save button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    deactivate server
    server-->>browser: {"message":"note created"}

```