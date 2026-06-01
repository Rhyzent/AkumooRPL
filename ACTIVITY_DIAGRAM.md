# Activity Diagram - Akumoo RPL

## User Flow Diagram (Pelanggan)

```mermaid
graph TD
    Start([Pengunjung]) --> Home["Home Page<br/>(Index)"]
    Home --> Browse{Apa yang<br/>ingin dilakukan?}
    
    Browse -->|Lihat Menu| MenuPage["Menu Page"]
    Browse -->|Baca Tentang| AboutPage["Tentang Page"]
    Browse -->|Langsung Pesan| OrderPage["Pemesanan Page"]
    
    MenuPage --> Filter["Filter & Cari Menu<br/>- Kategori<br/>- Search<br/>- Sort"]
    Filter --> ViewItem["Lihat Detail Menu"]
    ViewItem --> AddCart{Tambah ke<br/>Keranjang?}
    AddCart -->|Ya| OrderPage
    AddCart -->|Tidak| Filter
    
    AboutPage --> BackHome["Kembali ke Home"]
    BackHome --> Home
    
    OrderPage --> SelectItems["Step 1: Pilih Menu<br/>- Tambah/Kurangi Qty<br/>- Lihat Subtotal"]
    SelectItems --> FillData["Step 2: Isi Data Diri<br/>- Nama Lengkap<br/>- No. WhatsApp"]
    FillData --> ChooseDelivery["Step 3: Pilih Pengiriman<br/>- Dikirim (+ Rp8.000)<br/>- Diambil Sendiri"]
    
    ChooseDelivery -->|Dikirim| FillAddress["Isi Alamat Lengkap"]
    ChooseDelivery -->|Diambil| NoteOrder["Catatan (Optional)"]
    FillAddress --> NoteOrder
    
    NoteOrder --> ChoosePayment["Step 4: Pilih Pembayaran<br/>- Transfer Bank<br/>- COD"]
    ChoosePayment --> Validate{Data &<br/>Valid?}
    
    Validate -->|Tidak| ErrorMsg["❌ Tampil Error"]
    ErrorMsg --> OrderPage
    Validate -->|Ya| Review["📋 Review Pesanan<br/>- Total Harga<br/>- Metode Kirim<br/>- Metode Bayar"]
    
    Review --> Submit["Submit Pesanan"]
    Submit --> SaveDB["💾 Simpan ke Database<br/>- Insert Orders<br/>- Insert Order Items"]
    SaveDB --> Confirmation["✅ Halaman Konfirmasi<br/>- Order Code: AKM-XXXXX<br/>- Total: Rp XXXX<br/>- Instruksi Pembayaran"]
    Confirmation --> End([Pesanan Selesai])
```

## Admin Flow Diagram (Admin Panel)

```mermaid
graph TD
    AdminStart([Admin Login]) --> AuthCheck{User<br/>Auth?}
    AuthCheck -->|Tidak| LoginPage["Login Page<br/>- Email Input<br/>- Password Input"]
    LoginPage --> Validate{Valid<br/>Creds?}
    Validate -->|Tidak| LoginError["❌ Login Error"]
    LoginError --> LoginPage
    Validate -->|Ya| SetAuth["✅ Set Auth Session"]
    SetAuth --> Dashboard
    
    AuthCheck -->|Ya| Dashboard["📊 Dashboard<br/>- Order Stats<br/>- Menu Overview<br/>- Recent Orders"]
    
    Dashboard --> Navigate{Menu Admin<br/>?}
    
    Navigate -->|Orders| OrdersAdmin["📦 Kelola Pesanan<br/>- View All Orders<br/>- Filter by Status<br/>- Update Status<br/>- Delete Order"]
    Navigate -->|Menu| MenuAdmin["🍽️ Kelola Menu<br/>- Add Menu Item<br/>- Edit Menu<br/>- Delete Menu<br/>- Toggle Active"]
    Navigate -->|Categories| CatAdmin["📂 Kelola Kategori<br/>- Add Category<br/>- Edit Category<br/>- Delete Category"]
    Navigate -->|Admins| AdminsAdmin["👥 Kelola Admin<br/>- Add Admin User<br/>- Remove Admin<br/>- View Admin List"]
    
    OrdersAdmin --> OrderAction{Aksi?}
    OrderAction -->|Update Status| UpdateStatus["Change Status<br/>baru → diproses → selesai<br/>atau dibatalkan"]
    OrderAction -->|Hapus| DeleteOrder["Delete Order<br/>from Database"]
    UpdateStatus --> SaveChange["💾 Save to DB"]
    DeleteOrder --> SaveChange
    SaveChange --> Dashboard
    
    MenuAdmin --> MenuItem{Aksi?}
    MenuItem -->|Add| AddMenu["Isi Form Menu Baru<br/>- Nama, Deskripsi<br/>- Harga, Diskon<br/>- Kategori<br/>- Upload Image"]
    MenuItem -->|Edit| EditMenu["Edit Menu Item<br/>Update Fields"]
    MenuItem -->|Delete| DeleteMenu["Hapus Menu"]
    AddMenu --> SaveMenu["💾 Save to DB"]
    EditMenu --> SaveMenu
    DeleteMenu --> SaveMenu
    SaveMenu --> Dashboard
    
    CatAdmin --> CatAction{Aksi?}
    CatAction -->|Add| AddCat["Isi Nama Kategori<br/>Set Sort Order"]
    CatAction -->|Edit| EditCat["Edit Kategori"]
    CatAction -->|Delete| DelCat["Hapus Kategori"]
    AddCat --> SaveCat["💾 Save to DB"]
    EditCat --> SaveCat
    DelCat --> SaveCat
    SaveCat --> Dashboard
    
    AdminsAdmin --> AdminAction{Aksi?}
    AdminAction -->|Add| AddAdmin["Tambah Admin Baru<br/>- Email<br/>- Assign Role"]
    AdminAction -->|Remove| RemoveAdmin["Hapus Admin Access"]
    AddAdmin --> SaveAdmin["💾 Save to DB"]
    RemoveAdmin --> SaveAdmin
    SaveAdmin --> Dashboard
    
    Dashboard --> Logout["Logout"]
    Logout --> AdminStart
```

## Complete System Flow (User + Admin)

```mermaid
stateDiagram-v2
    [*] --> PublicHome: Visit Website
    
    PublicHome --> MenuBrowse: Browse Menu
    MenuBrowse --> AddToCart: Select Items
    AddToCart --> OrderForm: Go to Checkout
    
    OrderForm --> FillForm: Enter Details
    FillForm --> ValidateForm: Form Valid?
    ValidateForm --> FormError: ❌ No
    FormError --> OrderForm: Fix Error
    ValidateForm --> SubmitOrder: ✅ Yes
    
    SubmitOrder --> SaveDatabase: Insert Orders
    SaveDatabase --> ConfirmationPage: Show Order Code
    ConfirmationPage --> PaymentInstruct: Wait for Payment
    
    PaymentInstruct --> [*]: Pesanan Selesai
    
    [*] --> AdminAuth: Admin Access
    AdminAuth --> LoginCheck: Verify Creds
    LoginCheck --> LoginFail: ❌ Failed
    LoginFail --> AdminAuth: Retry
    LoginCheck --> Dashboard: ✅ Success
    
    Dashboard --> ManageOrders: View Orders
    ManageOrders --> UpdateOrder: Change Status
    UpdateOrder --> SaveOrderDB: Save Changes
    SaveOrderDB --> Dashboard
    
    Dashboard --> ManageMenu: Manage Menu
    ManageMenu --> CRUDMenu: Add/Edit/Delete
    CRUDMenu --> SaveMenuDB: Save Changes
    SaveMenuDB --> Dashboard
    
    Dashboard --> ManageCategories: Manage Categories
    ManageCategories --> CRUDCategories: Add/Edit/Delete
    CRUDCategories --> SaveCatDB: Save Changes
    SaveCatDB --> Dashboard
    
    Dashboard --> ManageAdmins: Manage Admins
    ManageAdmins --> CRUDAdmins: Add/Remove
    CRUDAdmins --> SaveAdminDB: Save Changes
    SaveAdminDB --> Dashboard
    
    Dashboard --> [*]: Logout
```

## Pemesanan Page Activity Flow (Detail)

```mermaid
sequenceDiagram
    actor User as Pelanggan
    participant Page as Pemesanan Page
    participant Cart as Cart State
    participant Form as Form State
    participant DB as Supabase DB
    participant Confirm as Konfirmasi Page
    
    User->>Page: Load Halaman Pemesanan
    Page->>Page: Show Menu Items List
    
    loop Select Items
        User->>Page: Klik + Tambah / - Kurangi
        Page->>Cart: Update Qty
        Cart->>Page: Render Updated Cart
    end
    
    User->>Page: Isi Data Diri
    Page->>Form: Update Nama, No HP
    
    User->>Page: Pilih Delivery (Dikirim/Diambil)
    Page->>Form: Set Delivery Method
    alt Dikirim
        Page->>Page: Show Alamat Field
        User->>Page: Isi Alamat
        Page->>Form: Update Alamat
    end
    
    User->>Page: Isi Catatan (Optional)
    Page->>Form: Update Catatan
    
    User->>Page: Pilih Payment (Transfer/COD)
    Page->>Form: Set Payment Method
    
    User->>Page: Klik "Konfirmasi Pesanan"
    Page->>Page: Validate Form
    
    alt Invalid Data
        Page->>User: Tampil Error Message
    else Valid Data
        Page->>Page: Generate Order Code (AKM-XXXXX)
        Page->>DB: INSERT INTO orders
        DB->>DB: Create order record
        Page->>DB: INSERT INTO order_items
        DB->>DB: Insert menu items
        Page->>Confirm: Navigate with Order Data
        Confirm->>User: Show Confirmation Page
    end
```

## Menu Filtering & Searching Logic

```mermaid
graph LR
    AllItems["📋 All Menu Items<br/>dari Database"]
    
    AllItems --> Filter1{"Filter by<br/>Category"}
    Filter1 -->|All| Filter2["Semua Kategori"]
    Filter1 -->|Specific| Filter2
    
    Filter2 --> Filter3{"Search by<br/>Name"}
    Filter3 -->|Empty| Filter4["Semua Item"]
    Filter3 -->|Query| Filter4
    
    Filter4 --> Filter5{"Sort by"}
    Filter5 -->|Default| Result["Urutan Default"]
    Filter5 -->|Price ASC| Result
    Filter5 -->|Price DESC| Result
    Filter5 -->|Name A-Z| Result
    
    Result --> Display["🎯 Display<br/>Filtered Results<br/>Grid Layout<br/>Menu Cards"]
    
    Display --> Empty{Results<br/>Empty?}
    Empty -->|Ya| NoFound["❌ 'Tidak ada menu<br/>yang cocok'"]
    Empty -->|Tidak| Show["✅ Show Cards"]
```

## Authentication & Authorization Flow

```mermaid
graph TD
    Request["User Request"]
    Request --> CheckAuth{Session<br/>Exists?}
    
    CheckAuth -->|No| PublicPage["Public Pages:<br/>- Home<br/>- Menu<br/>- Tentang<br/>- Pemesanan<br/>- Konfirmasi"]
    
    CheckAuth -->|Yes| CheckRole{User<br/>Role?}
    CheckRole -->|Admin| AdminLayout["Admin Layout<br/>Protected Routes"]
    CheckRole -->|User| PublicPage
    
    AdminLayout --> AdminCheck{"Admin<br/>Verified?"}
    AdminCheck -->|No| LoginRedirect["Redirect ke /admin/login"]
    AdminCheck -->|Yes| Dashboard["✅ Dashboard<br/>+ Orders<br/>+ Menu<br/>+ Categories<br/>+ Admins"]
    
    LoginRedirect --> LoginPage["Login Page"]
    LoginPage --> SubmitCreds["Submit Email + Password"]
    SubmitCreds --> AuthDB["Check Supabase Auth"]
    AuthDB --> AuthSuccess{Auth<br/>Success?}
    AuthSuccess -->|No| LoginError["❌ Error Message"]
    LoginError --> LoginPage
    AuthSuccess -->|Yes| CreateSession["✅ Create Session"]
    CreateSession --> Dashboard
```

## Database Transaction Flow (Order Creation)

```mermaid
graph LR
    Submit["User Submit<br/>Pemesanan"] 
    Submit --> Validate["Validate Data<br/>- Items<br/>- Form Fields<br/>- Payment Method"]
    
    Validate --> Valid{Data OK?}
    Valid -->|No| Error["❌ Validation Error"]
    Error --> User["Return to Form"]
    
    Valid -->|Yes| Generate["Generate Order ID<br/>AKM-XXXXXX"]
    Generate --> TxStart["🔄 Begin Transaction"]
    
    TxStart --> Insert1["INSERT orders<br/>- order_code<br/>- customer_name<br/>- customer_phone<br/>- address<br/>- delivery_method<br/>- payment_method<br/>- subtotal, shipping_fee, total"]
    
    Insert1 --> Insert1Status{Success?}
    Insert1Status -->|No| TxRollback["⚠️ Rollback"]
    TxRollback --> TxError["❌ Error Toast"]
    TxError --> User
    
    Insert1Status -->|Yes| Insert2["INSERT order_items<br/>For each cart item<br/>- order_id<br/>- name<br/>- price<br/>- qty"]
    
    Insert2 --> Insert2Status{Success?}
    Insert2Status -->|No| TxRollback
    Insert2Status -->|Yes| TxCommit["✅ Commit Transaction"]
    
    TxCommit --> Navigate["Navigate to<br/>/konfirmasi"]
    Navigate --> ConfirmPage["Show Confirmation<br/>with Order Details"]
```

## Component Interaction Diagram

```mermaid
graph TB
    subgraph App["App.tsx (Main Router)"]
        Router["BrowserRouter"]
        QueryProvider["QueryClientProvider"]
        AuthProvider["AuthProvider"]
        TooltipProvider["TooltipProvider"]
    end
    
    subgraph Public["Public Pages"]
        Index["Index (Home)"]
        Menu["Menu (Browse)"]
        Tentang["Tentang (About)"]
        Pemesanan["Pemesanan (Order)"]
        Konfirmasi["Konfirmasi (Confirm)"]
    end
    
    subgraph Admin["Admin Pages"]
        Login["Login"]
        Dashboard["Dashboard"]
        Orders["Orders"]
        MenuAdmin["MenuAdmin"]
        Categories["Categories"]
        Admins["Admins"]
    end
    
    subgraph Shared["Shared Components"]
        Layout["Layout (Navbar + Footer)"]
        Navbar["Navbar"]
        Footer["Footer"]
        MenuCard["MenuCard"]
        Button["Button (UI)"]
        Input["Input (UI)"]
        Modal["Modal (UI)"]
    end
    
    subgraph Hooks["Custom Hooks"]
        useAuth["useAuth<br/>(Auth State)"]
        useShopData["useShopData<br/>(Menu Data)"]
        useSEO["useSEO<br/>(SEO Meta)"]
    end
    
    subgraph Integration["External Services"]
        Supabase["Supabase<br/>- Auth<br/>- DB<br/>- Storage"]
        TanStack["TanStack Query<br/>(Data Fetching)"]
    end
    
    App --> QueryProvider
    QueryProvider --> AuthProvider
    AuthProvider --> TooltipProvider
    
    TooltipProvider --> Router
    Router --> Public
    Router --> Admin
    
    Public --> Layout
    Admin --> Layout
    
    Layout --> Navbar
    Layout --> Footer
    
    Pemesanan --> MenuCard
    Menu --> MenuCard
    Index --> MenuCard
    
    Public --> Hooks
    Admin --> Hooks
    
    Hooks --> Supabase
    Hooks --> TanStack
    
    MenuCard --> Button
    MenuCard --> Input
```
