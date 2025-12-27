# API Documentation

LibraKeeper uses Next.js API Routes. Most routes are protected by session-based authentication.

## Authentication

- `POST /api/register`: Register a new user.
- `POST /api/auth/*`: NextAuth.js endpoints (Google, Credentials).

## Profile

- `GET /api/profile`: Get current user profile.
- `PATCH /api/profile`: Update current user profile.

## Items

- `GET /api/items`: List all items.
- `POST /api/items`: Create new item (Admin only).
- `GET /api/items/[id]`: Get item details.
- `PATCH /api/items/[id]`: Update item (Admin only).
- `DELETE /api/items/[id]`: Delete item (Admin only).

## Interactions

- `POST /api/items/[id]/likes`: Toggle like on an item.
- `GET /api/items/[id]/likes`: Get like count and status.
- `POST /api/items/[id]/comments`: Post a comment.
- `GET /api/items/[id]/comments`: List comments for an item.
- `POST /api/items/[id]/report`: Report item as missing.

## Loans

- `GET /api/loans`: List loans (User's own or all for Admin).
- `POST /api/loans`: Request to borrow an item.
- `PATCH /api/loans/[id]`: Update loan status (Admin only).

## Suggestions

- `GET /api/suggestions`: List suggestions.
- `POST /api/suggestions`: Submit a suggestion.
- `PATCH /api/suggestions/[id]`: Update suggestion status (Admin only).

## Messages

- `GET /api/messages`: List conversations or messages in a conversation.
- `POST /api/messages`: Send a message.

## Admin

- `GET /api/admin/users`: List all users (Admin only).
- `PATCH /api/admin/users`: Update user role (Admin only).
- `GET /api/admin/export`: Export items as JSON/CSV (Admin only).
