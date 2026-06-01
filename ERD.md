# Entity Relationship Diagram (ERD) - AkumooRPL

## Database Schema Visualization

```mermaid
erDiagram
    AUTH_USERS ||--o{ USER_ROLES : has
    CATEGORIES ||--o{ MENU_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : "included_in"
    ORDERS ||--o{ ORDER_ITEMS : contains
    
    AUTH_USERS {
        uuid id PK
        string email
    }

    USER_ROLES {
        uuid id PK
        uuid user_id FK "references auth.users"
        app_role role "admin|user"
        timestamptz created_at
        unique "user_id, role"
    }

    CATEGORIES {
        uuid id PK
        text name UK "unique"
        text slug UK "unique"
        int sort_order
        timestamptz created_at
        timestamptz updated_at
    }

    MENU_ITEMS {
        uuid id PK
        text slug UK "unique"
        text name
        text description
        numeric price "10,2"
        text image_url
        uuid category_id FK "references categories"
        text badge "Best Seller, Favorit, Hemat"
        boolean is_active "default: true"
        number discount_price
        int sort_order
        timestamptz created_at
        timestamptz updated_at
    }

    PROMOS {
        uuid id PK
        text title
        text description
        text image_url
        boolean is_active "default: true"
        timestamptz starts_at
        timestamptz ends_at
        timestamptz created_at
        timestamptz updated_at
    }

    ORDERS {
        uuid id PK
        text order_code UK "unique"
        text customer_name
        text customer_phone
        text address
        text notes
        delivery_method delivery "dikirim|diambil"
        payment_method payment "transfer|cod"
        numeric subtotal "10,2"
        numeric shipping_fee "10,2"
        numeric total "10,2"
        order_status status "baru|diproses|selesai|dibatalkan"
        timestamptz created_at
        timestamptz updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK "references orders (cascade)"
        uuid menu_item_id FK "references menu_items (set null)"
        text name
        numeric price "10,2"
        int qty "check: qty > 0"
        timestamptz created_at
    }
```

## Table Details

### 📱 Authentication & Authorization
**user_roles**
- Manage admin & user roles
- RLS policies untuk kontrol akses
- Fungsi: `has_role()`, `admin_exists()`

### 🍽️ Menu Management
**categories**
- Kategori: Bento, Geprek, Sarapan, Cemilan
- Sortable dengan `sort_order`

**menu_items**
- Detail produk makanan
- Support badge (Best Seller, Favorit, Hemat)
- Support diskon dengan `discount_price`
- Active/inactive toggle

### 🎯 Promotion
**promos**
- Time-based promotions
- `starts_at` & `ends_at` untuk schedule

### 📦 Orders & Items
**orders**
- Customer order dengan status tracking
- Delivery method: dikirim (delivery) atau diambil (pickup)
- Payment method: transfer atau COD

**order_items**
- Line items dalam order
- Store nama & harga snapshot

## Enums

```
app_role: "admin" | "user"
delivery_method: "dikirim" | "diambil"
order_status: "baru" | "diproses" | "selesai" | "dibatalkan"
payment_method: "transfer" | "cod"
```

## Database Indexes

```sql
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## Security (Row Level Security)

- ✅ Public read active menu & promos
- ✅ Public can create orders & order items
- ✅ Admin manage categories, menu, promos, orders
- ✅ Users view only their own roles
- ✅ Admins view all roles

## Relationships

- `categories` 1:N `menu_items` (via category_id)
- `menu_items` 1:N `order_items` (via menu_item_id)
- `orders` 1:N `order_items` (via order_id)
- `auth.users` 1:N `user_roles` (via user_id)
