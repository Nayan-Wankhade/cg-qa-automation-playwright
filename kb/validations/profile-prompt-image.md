# Validation: Prompt Image Upload

**Applies to:** Profile Builder Tab 3 (Profile Prompts) — Add Prompt and Edit Prompt modals.

## File constraints

| Rule | Value |
|---|---|
| Max file size | 2 MB (boundary value 2 MB exactly is accepted) |
| Supported formats | JPG, JPEG, PNG, GIF, WebP |
| Rejected formats | All non-image types (e.g., .pdf, .doc, .txt) |

## Image Cropper

When a valid image is selected from the file picker, the **Image Cropper** opens with the heading **Crop your Image** and contains:

- The selected image displayed inside the crop area
- A fixed **16:9** crop frame overlaid on the image — the user can move and resize the crop frame, but the 16:9 aspect ratio is always maintained
- A **Cancel** button — closes the cropper and discards the image
- A **Save Cropped Image** button — saves the cropped image into the Profile Prompt modal
- An **X** (close) icon in the top-right corner — closes the cropper without saving

### Recommended resolution

- Recommended: 1920 × 1080 px
- Minimum: 1280 × 720 px (smaller images may appear blurry)

## Uploaded image in the Profile Prompt modal

After the cropper saves an image:

- The cropped image is displayed inside the dropzone area of the Profile Prompt modal
- An **X** icon appears in the top-right corner of the image; clicking it removes the image and returns the dropzone to the **Click to upload image** placeholder

## Validation table

| Scenario | Expected |
|---|---|
| Valid image (JPG/PNG/JPEG/GIF/WebP) ≤ 2 MB | Image Cropper opens with the image and a 16:9 crop frame |
| Image at exactly 2 MB | Accepted |
| Image > 2 MB | Error: file too large; cropper does not open |
| Non-image file (.pdf, .doc, etc.) | Error: invalid file type; cropper does not open |
| Image only (no Header, no Description) | Accepted — saves as **Untitled Section** in builder; on the Impact Profile, no title is shown |

## Known divergence from design (as of RES-527)

The Figma design shows **Upload** and **Use another image** buttons in the cropper, but the build ships with **Cancel** and **Save Cropped Image** plus an **X** close icon. Tracked under bug **RES-886** (Low priority). Tests assert build behavior; cropper button labels in the build are the source of truth until RES-886 is resolved.

## Description display

- Descriptions > 300 characters show a **View More** button on the Impact Profile.
