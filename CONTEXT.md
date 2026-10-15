# Personal bookmarks

This context owns a user's private bookmarks, the context used to recover them, and the background enrichment that makes URL-only capture useful.

## Ownership and identity

**User**:
The authenticated person who privately owns bookmarks and tags.
_Avoid_: Account, customer

**Bookmark**:
A user-owned saved reference to one submitted URL. A bookmark keeps its identity when the destination redirects or page metadata changes.
_Avoid_: Page, document, link record

**Bookmark ID**:
The stable opaque identity of a bookmark. It never grants access by itself; ownership still decides who may read or change the bookmark.
_Avoid_: Search row ID, URL

**Submitted URL**:
The exact URL the user entered and the destination the bookmark opens.
_Avoid_: Canonical URL, normalized URL

**Duplicate key**:
A derived URL value used only to decide whether the same user already has an active bookmark for that destination.
_Avoid_: Canonical URL

**Resolved URL**:
The final URL reached by a successful enrichment fetch after safe redirects. It is extracted context and does not replace the submitted URL.
_Avoid_: Submitted URL

**Page canonical URL**:
The preferred URL declared by the destination page. It is untrusted page metadata and never decides bookmark identity by itself.
_Avoid_: Duplicate key

## User and page context

**Bookmark title**:
An optional title written by the user for their own recall.
_Avoid_: Page title

**Bookmark description**:
Optional user-written context about why the bookmark matters.
_Avoid_: Note, page description

**Page metadata**:
Bounded facts extracted from the destination, such as its title, description, site name, favicon, and image candidates.
_Avoid_: Bookmark context

**Page text**:
Bounded normalized text extracted for retrieval. It is not a stored copy of the page.
_Avoid_: Archive, article copy

**Preview**:
The safe image selected for a bookmark card from extracted page metadata. A bookmark does not require a preview to remain usable.
_Avoid_: Screenshot, page archive

## Tags

**Tag**:
A reusable label that can be attached to many bookmarks. A tag is either a system default available to every user or a custom tag owned by one user.
_Avoid_: Folder, collection

**Starter tag**:
A system-owned tag available to every user so the first bookmarks have a useful closed vocabulary. Users cannot rename or delete the shared definition.
_Avoid_: Seeded user tag

**Tag assignment**:
The relationship that attaches a starter tag or one of the user's custom tags to that user's bookmark.
_Avoid_: Bookmark tag value

**Auto-assigned tag**:
A tag assignment that Jev creates after enrichment provides enough classification context. It must use a starter tag or the user's existing custom tag; Jev never creates a new tag name.
_Avoid_: Generated tag

## Enrichment and retrieval

**Enrichment attempt**:
One bounded background attempt to fetch a bookmark's destination and derive page context, auto-assigned tags, and a preview.
_Avoid_: Bookmark import, crawl

**Enrichment state**:
The current user-visible outcome of the latest enrichment attempt: pending, running, complete, partial, or failed.
_Avoid_: Bookmark state

**Search document**:
A searchable copy of the submitted URL, user context, and extracted page context. It can always be rebuilt from the saved bookmark and page context; it does not decide bookmark ownership or deletion.
_Avoid_: Bookmark, archive

**Deleted bookmark**:
A bookmark hidden from the active library and retrieval results while retained for recovery or later removal.
_Avoid_: Archived bookmark

**Trash**:
The temporary collection of deleted bookmarks that remain recoverable during the retention period.
_Avoid_: Archive
