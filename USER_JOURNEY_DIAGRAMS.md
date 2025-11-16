# User Journey Diagrams - Dispute Resolution Platform

This document contains user journey diagrams for all five user personas in the platform.

---

## 1. CLAIMANT Journey

```mermaid
graph TD
    Start([User Visits Platform]) --> SignUp[Sign Up / Sign In]
    SignUp --> Dashboard[Access Dashboard]
    Dashboard --> FileCase[Click 'File New Case']

    FileCase --> FillForm[Complete Claim Form]
    FillForm --> Form1[Enter Personal Info<br/>Phone, Address, Contact Preference]
    Form1 --> Form2[Enter Respondent Info<br/>Name, Email Required]
    Form2 --> Form3[Enter Dispute Details<br/>Category, Date, Location, Amount]
    Form3 --> Form4[Add Description & Evidence<br/>Upload Files, Add Witnesses]
    Form4 --> Form5[Document Resolution Attempts<br/>Previous efforts to resolve]
    Form5 --> Form6[Electronic Signature<br/>Accept Declaration]

    Form6 --> Submit[Submit Claim]
    Submit --> AutoInvite[System Sends Email<br/>Invitation to Respondent]
    AutoInvite --> Status1[Case Status:<br/>PENDING_RESPONDENT]

    Status1 --> Wait1{Respondent<br/>Responds?}
    Wait1 -->|Yes| Status2[Case Status:<br/>ASSIGNED_TO_MANAGER]
    Wait1 -->|Waiting| TrackProgress[Monitor via Dashboard]
    TrackProgress --> Wait1

    Status2 --> Wait2[Wait for Case Manager<br/>Pre-Proceeding Calls]
    Wait2 --> Status3[Case Status:<br/>PENDING_NEUTRAL]

    Status3 --> Wait3[Wait for Neutral<br/>to Review]
    Wait3 --> Decision[Receive Decision Email]
    Decision --> ViewDecision[View Judgment<br/>on Case Details Page]
    ViewDecision --> End([Journey Complete])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Submit fill:#ffd700
    style Decision fill:#87ceeb
```

**Key Touchpoints:**
- Dashboard → File New Case → Form Submission → Case Tracking → Decision Receipt
- Receives automated emails at key milestones
- Primary action: Filing comprehensive claim form

---

## 2. RESPONDENT Journey

```mermaid
graph TD
    Start([Receive Email Invitation]) --> ClickLink[Click Invitation Link<br/>with Token]

    ClickLink --> CheckAuth{Already<br/>Registered?}
    CheckAuth -->|No| AutoRegister[System Auto-Creates Account<br/>with Temporary Password]
    CheckAuth -->|Yes| Login[Sign In]

    AutoRegister --> EmailCreds[Receive Credentials Email]
    EmailCreds --> FirstLogin[First Login with<br/>Temp Password]
    FirstLogin --> ViewCase[View Case Details]

    Login --> ViewCase
    ViewCase --> ReadClaim[Read Claimant's<br/>Request & Details]
    ReadClaim --> DecideResponse{Respond to<br/>Claim?}

    DecideResponse -->|Yes| RespondForm[Navigate to Respond Page<br/>/cases/[id]/respond]
    DecideResponse -->|No| Ignore[Ignore - No Response]
    Ignore --> End1([Case May Proceed<br/>Without Response])

    RespondForm --> FillResponse[Submit Response<br/>to Claimant's Request]
    FillResponse --> SubmitResponse[Submit Response]
    SubmitResponse --> StatusChange[Case Status Changes:<br/>ASSIGNED_TO_MANAGER]

    StatusChange --> TrackCase[Monitor Case<br/>via Dashboard]
    TrackCase --> Wait1[Wait for Case Manager<br/>Pre-Proceeding Call]
    Wait1 --> PreProceeding[Participate in<br/>Pre-Proceeding Call]
    PreProceeding --> Wait2[Wait for Neutral<br/>Review]

    Wait2 --> ReceiveDecision[Receive Decision Email]
    ReceiveDecision --> ViewDecision[View Judgment<br/>on Case Page]
    ViewDecision --> End2([Journey Complete])

    style Start fill:#e1f5e1
    style End1 fill:#ffe1e1
    style End2 fill:#ffe1e1
    style SubmitResponse fill:#ffd700
    style ReceiveDecision fill:#87ceeb
```

**Key Touchpoints:**
- Email Invitation → Auto-Registration → Case Review → Response Submission → Pre-Proceeding → Decision
- May receive temporary credentials via email
- Primary action: Submitting response to claim

---

## 3. CASE_MANAGER Journey

```mermaid
graph TD
    Start([Created by Registrar]) --> ReceiveEmail[Receive Email with<br/>Temporary Password]
    ReceiveEmail --> FirstLogin[First Login to Platform]

    FirstLogin --> Portal[Access Case Manager Portal<br/>/case-manager]
    Portal --> ViewAssigned[View Assigned Cases]

    ViewAssigned --> SelectCase[Select a Case<br/>to Manage]
    SelectCase --> ReviewDetails[Review Case Details<br/>Claim & Response]

    ReviewDetails --> PreProcClaimant[Schedule & Conduct<br/>Pre-Proceeding Call<br/>with Claimant]
    PreProcClaimant --> MarkClaimantComplete[Mark Claimant<br/>Call Complete]
    MarkClaimantComplete --> EmailClaimant[System Sends Email<br/>to Claimant]
    EmailClaimant --> Status1[Case Status:<br/>PENDING_PREPROCEEDING_RESPONDENT]

    Status1 --> PreProcRespondent[Schedule & Conduct<br/>Pre-Proceeding Call<br/>with Respondent]
    PreProcRespondent --> MarkRespondentComplete[Mark Respondent<br/>Call Complete]
    MarkRespondentComplete --> EmailRespondent[System Sends Email<br/>to Respondent]
    EmailRespondent --> Status2[Case Status:<br/>PENDING_NEUTRAL]

    Status2 --> HandoffNeutral[Case Handed Off<br/>to Neutral]
    HandoffNeutral --> MonitorProgress[Monitor Case Progress<br/>via Dashboard]

    MonitorProgress --> MoreCases{More Assigned<br/>Cases?}
    MoreCases -->|Yes| ViewAssigned
    MoreCases -->|No| End([Ongoing Monitoring])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style MarkClaimantComplete fill:#ffd700
    style MarkRespondentComplete fill:#ffd700
    style HandoffNeutral fill:#87ceeb
```

**Key Touchpoints:**
- Account Creation → Login → View Cases → Pre-Proceeding Calls → Handoff to Neutral
- Conducts two separate pre-proceeding calls
- Primary action: Facilitating pre-proceeding discussions

---

## 4. NEUTRAL (Mediator/Arbitrator) Journey

```mermaid
graph TD
    Start([Created by Registrar]) --> ReceiveEmail[Receive Assignment<br/>Notification Email]
    ReceiveEmail --> FirstLogin[Login with<br/>Temporary Password]

    FirstLogin --> Portal[Access Neutral Portal<br/>/neutral]
    Portal --> ViewAssigned[View Assigned Cases<br/>Status: PENDING_NEUTRAL]

    ViewAssigned --> SelectCase[Select Case<br/>to Review]
    SelectCase --> ReviewCase[Review Complete<br/>Case Details]

    ReviewCase --> Review1[Read Claimant's<br/>Request & Evidence]
    Review1 --> Review2[Read Respondent's<br/>Response]
    Review2 --> Review3[Review Pre-Proceeding<br/>Call Notes if any]

    Review3 --> ConsiderDecision[Consider Fair<br/>and Just Decision]
    ConsiderDecision --> GenerateJudgment[Click 'Generate Judgment'<br/>AI-Powered Decision]

    GenerateJudgment --> AIProcess[Llama 3.2 Model<br/>Analyzes Both Positions]
    AIProcess --> JudgmentCreated[Comprehensive Decision<br/>Generated]

    JudgmentCreated --> ReviewJudgment[Review Generated<br/>Judgment]
    ReviewJudgment --> SaveDecision[Decision Auto-Saved<br/>to Database]
    SaveDecision --> StatusChange[Case Status:<br/>DECISION_ISSUED]

    StatusChange --> NotifyParties[System Sends Emails<br/>to Both Parties]
    NotifyParties --> CaseComplete[Case Completed]

    CaseComplete --> MoreCases{More Cases<br/>to Review?}
    MoreCases -->|Yes| ViewAssigned
    MoreCases -->|No| End([Ongoing Monitoring])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style GenerateJudgment fill:#ffd700
    style NotifyParties fill:#87ceeb
    style AIProcess fill:#dda0dd
```

**Key Touchpoints:**
- Account Creation → Assignment → Case Review → AI Judgment Generation → Decision Issuance
- Uses AI to generate fair, reasoned decisions
- Primary action: Issuing final judgment

---

## 5. REGISTRAR (Administrator) Journey

```mermaid
graph TD
    Start([Login to Platform]) --> AdminDashboard[Access Admin Dashboard<br/>/admin/cases]

    AdminDashboard --> ViewAll[View ALL Cases<br/>System-Wide Visibility]

    ViewAll --> Decision1{What Action<br/>to Take?}

    Decision1 -->|Manage Existing Case| SelectCase[Select Case<br/>to Manage]
    Decision1 -->|Create New User| UserManagement[Navigate to<br/>User Management<br/>/admin/users]
    Decision1 -->|File Case for Someone| FileCase[Navigate to<br/>File New Case]

    %% Case Management Flow
    SelectCase --> ReviewCase[Review Case Details<br/>Claim & Response]
    ReviewCase --> AssignStaff[Assign Case Officials]
    AssignStaff --> AssignCM[Assign Case Manager]
    AssignCM --> AssignNeutral[Assign Neutral]
    AssignNeutral --> StatusChange[Case Status:<br/>ASSIGNED_TO_MANAGER]
    StatusChange --> NotifyAssigned[System Sends Emails<br/>to Assigned Officials]
    NotifyAssigned --> MonitorCase[Monitor Case Progress]

    %% User Management Flow
    UserManagement --> CreateUser{Create<br/>User Type?}
    CreateUser -->|Case Manager| CreateCM[Create Case Manager<br/>Account]
    CreateUser -->|Neutral| CreateNeutral[Create Neutral<br/>Account]

    CreateCM --> GeneratePass1[Generate Temporary<br/>Password]
    CreateNeutral --> GeneratePass2[Generate Temporary<br/>Password]
    GeneratePass1 --> SendEmail1[Send Invitation Email<br/>with Credentials]
    GeneratePass2 --> SendEmail2[Send Invitation Email<br/>with Credentials]

    %% File Case Flow
    FileCase --> FillClaimForm[Complete Claim Form<br/>on Behalf of Claimant]
    FillClaimForm --> SubmitClaim[Submit Claim]
    SubmitClaim --> InviteRespondent[System Sends<br/>Invitation to Respondent]

    %% Return to Dashboard
    MonitorCase --> ReturnDash[Return to Dashboard]
    SendEmail1 --> ReturnDash
    SendEmail2 --> ReturnDash
    InviteRespondent --> ReturnDash

    ReturnDash --> MoreTasks{More<br/>Tasks?}
    MoreTasks -->|Yes| ViewAll
    MoreTasks -->|No| ContinueMonitor[Continue System<br/>Monitoring]

    ContinueMonitor --> End([Ongoing Administration])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style AssignStaff fill:#ffd700
    style CreateCM fill:#87ceeb
    style CreateNeutral fill:#87ceeb
    style SubmitClaim fill:#ffd700
```

**Key Touchpoints:**
- Login → System Overview → Case Assignment / User Creation / Case Filing → Monitoring
- Has access to all system functions
- Primary actions: Assigning cases, creating users, system oversight

---

## Complete Case Flow (All Personas)

```mermaid
graph TD
    subgraph "Filing Stage"
        A1[CLAIMANT<br/>Files New Case] --> A2[Complete Claim Form]
        A2 --> A3[Submit Claim]
        A3 --> A4[Status: PENDING_RESPONDENT]
    end

    subgraph "Response Stage"
        A4 --> B1[System Emails<br/>RESPONDENT]
        B1 --> B2[RESPONDENT<br/>Receives Invitation]
        B2 --> B3{Responds?}
        B3 -->|Yes| B4[Submit Response]
        B3 -->|No| B5[Case Proceeds<br/>Anyway]
        B4 --> B6[Status: ASSIGNED_TO_MANAGER]
        B5 --> B6
    end

    subgraph "Assignment Stage"
        B6 --> C1[REGISTRAR<br/>Assigns Officials]
        C1 --> C2[Assign Case Manager]
        C2 --> C3[Assign Neutral]
        C3 --> C4[Notify Assigned Staff]
    end

    subgraph "Pre-Proceeding Stage"
        C4 --> D1[CASE MANAGER<br/>Conducts Calls]
        D1 --> D2[Call with Claimant]
        D2 --> D3[Mark Complete]
        D3 --> D4[Status: PENDING_PREPROCEEDING_RESPONDENT]
        D4 --> D5[Call with Respondent]
        D5 --> D6[Mark Complete]
        D6 --> D7[Status: PENDING_NEUTRAL]
    end

    subgraph "Decision Stage"
        D7 --> E1[NEUTRAL<br/>Reviews Case]
        E1 --> E2[Generate AI Judgment]
        E2 --> E3[Issue Decision]
        E3 --> E4[Status: DECISION_ISSUED]
        E4 --> E5[Email Both Parties]
    end

    subgraph "Completion Stage"
        E5 --> F1[CLAIMANT & RESPONDENT<br/>View Decision]
        F1 --> F2[Case Closed]
    end

    style A1 fill:#e1f5e1
    style B2 fill:#e1f5e1
    style C1 fill:#e1f5e1
    style D1 fill:#e1f5e1
    style E1 fill:#e1f5e1
    style F2 fill:#ffe1e1
    style E2 fill:#dda0dd
```

---

## User Interaction Matrix

| Stage | Claimant | Respondent | Case Manager | Neutral | Registrar |
|-------|----------|------------|--------------|---------|-----------|
| **Filing** | ⭐ Primary Actor | - | - | - | Can file on behalf |
| **Invitation** | - | ⭐ Primary Actor | - | - | - |
| **Assignment** | Receives notification | Receives notification | ⭐ Gets assigned | ⭐ Gets assigned | ⭐ Primary Actor |
| **Pre-Proceeding** | Participates | Participates | ⭐ Primary Actor | - | Monitors |
| **Decision** | Receives decision | Receives decision | Monitors | ⭐ Primary Actor | Monitors |
| **Ongoing** | Monitors case | Monitors case | Monitors case | Monitors case | ⭐ Oversees all |

---

## Key Email Touchpoints

### Automated Emails Sent:

1. **Claimant → Respondent**: Invitation to respond to case
2. **Registrar → Case Manager**: Assignment with temporary credentials
3. **Registrar → Neutral**: Assignment with temporary credentials
4. **Case Manager → Claimant**: Pre-proceeding call completed
5. **Case Manager → Respondent**: Pre-proceeding call completed
6. **Neutral → Both Parties**: Decision issued notification

---

## Platform Features by Persona

### 🔵 Claimant
- File new cases
- Track case status
- View filed cases
- Upload evidence
- Receive decision

### 🟢 Respondent
- Auto-registration via invitation
- Respond to claims
- View case details
- Track status
- Receive decision

### 🟡 Case Manager
- View assigned cases only
- Conduct pre-proceeding calls
- Mark call completion
- Send notifications
- Track case progress

### 🟣 Neutral
- View assigned cases only
- Review full case details
- AI-powered judgment generation
- Issue decisions
- Notify parties

### 🔴 Registrar (Admin)
- View ALL cases system-wide
- Assign case managers
- Assign neutrals
- Create new users (CM & Neutral)
- File cases on behalf of others
- Complete system oversight

---

## Case Status Progression

```mermaid
stateDiagram-v2
    [*] --> PENDING_RESPONDENT: Claimant files case
    PENDING_RESPONDENT --> ASSIGNED_TO_MANAGER: Respondent responds or<br/>Registrar assigns
    ASSIGNED_TO_MANAGER --> PENDING_PREPROCEEDING_RESPONDENT: CM completes<br/>claimant call
    PENDING_PREPROCEEDING_RESPONDENT --> PENDING_NEUTRAL: CM completes<br/>respondent call
    PENDING_NEUTRAL --> DECISION_ISSUED: Neutral issues<br/>judgment
    DECISION_ISSUED --> [*]: Case complete

    note right of PENDING_RESPONDENT
        Awaiting respondent
        to accept invitation
    end note

    note right of ASSIGNED_TO_MANAGER
        Case manager assigned
        Awaiting pre-proceeding
    end note

    note right of PENDING_NEUTRAL
        Awaiting neutral
        review and decision
    end note

    note right of DECISION_ISSUED
        Final judgment issued
        Both parties notified
    end note
```

---

## Access Control Summary

```mermaid
graph LR
    subgraph "View Own Cases"
        A[Claimant]
        B[Respondent]
        C[Case Manager]
        D[Neutral]
    end

    subgraph "View All Cases"
        E[Registrar]
    end

    A --> F[Limited Access]
    B --> F
    C --> F
    D --> F
    E --> G[Full System Access]

    style E fill:#ff6b6b
    style G fill:#ff6b6b
    style F fill:#87ceeb
```

---

## Technology Stack Used in Journeys

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **AI**: Llama 3.2 (via Ollama) for judgment generation
- **Email**: Nodemailer for automated notifications
- **Password**: bcrypt for hashing

---

*Generated on 2025-11-16*
