# Profile Prompts (Tab 3 of Profile Builder)

**Surface:** Tab within Profile Builder
**Accessible to:** All personas (Funder, Implementer, Both — verified via test cases)

## What this page is for

Create, edit, and delete custom content sections that appear on the
Impact Profile.

## CRUD operations

### Add a Prompt
- Modal with: Section Title, Description (rich-text), Image (≤ 2 MB)
- Image-only prompts allowed (no title or description required)
- Rich-text controls: B/I/U/Strike/ClearFormat, H1–H3, Blockquote/HR,
  Bullet/Numbered, Link/Unlink, Align (4-way)

### Edit a Prompt
- Opens the same modal pre-filled with existing content
- Clicking the saved image re-opens the Image Cropper for re-cropping
- Changes visible on Impact Profile after save

### Delete a Prompt
- Removes the section from Profile Prompts and Impact Profile

### View on Impact Profile
- Each prompt section displayed with title, description, image
- **Default placement:** below the Narrative section, above the Multimedia section (V2 — placement may shift if neighbouring sections have no data)
- **Visual separator** between multiple prompts
- **View More** button when description exceeds 300 characters
- If a prompt is saved without a Section Title, the builder shows it as **Untitled Section**, but **the title is not shown on the Impact Profile** for that prompt

## Image upload and cropping

Full image upload, format, and cropping rules live in `validations/profile-prompt-image.md`. Quick summary:

- Click **Click to upload image** dropzone → OS file picker opens
- Supported formats: JPG, JPEG, PNG, GIF, WebP — up to 2 MB
- Image opens in the **Image Cropper** with heading **Crop your Image**, a fixed 16:9 crop frame, **Cancel** and **Save Cropped Image** buttons, and an **X** close icon
- After saving, the cropped image appears in the dropzone with an **X** icon in its top-right corner that removes the image
- Recommended resolution 1920 × 1080 px; minimum 1280 × 720 px

## Save variations supported

A prompt can be saved with any of these combinations (rendered stacked horizontally on the Impact Profile):

1. Image only
2. Header + Image
3. Image + Description
4. Header + Image + Description

## Known bugs

| Bug | Description | Priority |
|---|---|---|
| RES-886 | Image Cropper shows Cancel / Save Cropped Image / X instead of Upload / Use another image (per design) | Low |
| RES-896 | Empty prompt (no Title, no Description, no Image) can be saved as **Untitled Section** — at least one field should be required | TBD |

## Validations

- Non-image files rejected with error message (see `validations/profile-prompt-image.md`)
- Image file > 2 MB rejected with error message
- Title and description can be empty if image is provided

## Notes

- Profile Prompts work identically across Funder, Implementer, and Both personas.
