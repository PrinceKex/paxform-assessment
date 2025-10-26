FORM 1
 OVERALL PURPOSE
This is the Builder view of a Student Leave Request Form (Sydney Campus). The user is in the process of constructing or editing the form structure. The interface is clean, minimal, and focused on drag-and-drop section building, with a left-hand navigation panel for quick section access.

🧭 INTERFACE LAYOUT — TOP NAVIGATION & HEADER
🔹 Top Header Bar
Title: Student Leave Request Form (Sydney Campus) — bold, dark blue text.
Form ID: FID 1234 5668 9869 — smaller gray text directly beneath title.
Back Arrow (←) — top-left corner, allows returning to previous screen.
Action Buttons (Top Right):
Import JSON — white button with cloud+arrow icon → imports form structure from JSON.
Publish — white button → makes form live/public.
Save — dark teal button (primary action) → saves current state.
Three-dot menu (...) → additional options (e.g., export, settings).
🔹 Tab Navigation Bar (Below Header)
Horizontal tab list with:

Details
Identities
Builder ← CURRENTLY ACTIVE (underlined in blue)
Settings
Embed
Theme
PDF Filler
API Mappings
Workflow
Digest
✅ WindSurf AI Note: Only “Builder” tab is active; others are inactive but clickable. 

📐 MAIN CONTENT AREA — FORM CANVAS
The canvas is divided into two main zones:

🧩 ZONE 1: LEFT PANEL — SECTION NAVIGATOR / TOOLBAR
A narrow vertical sidebar on the far left with two functional areas:

➤ Top Toolbar Icons
Two circular buttons stacked vertically:
Undo (↩️) — top button
Redo (↪️) — bottom button
Both have subtle borders and hover states implied.
➤ Section Number List
A vertical stack of numbered boxes: 01, 02, 03, 04, 05, 06, 07
Each number is centered inside a small square with light border.
Currently, no section is highlighted (unlike previous version) — meaning no active selection.
Below 07: a downward arrow (🔻) — indicates more sections exist beyond 07 (expandable).
At the very bottom:
A minus button (−)
A number field showing 100 — likely total sections or jump-to-section input.
A plus button (+) — adds new section at end.
✅ WindSurf AI Note: This is a section index + pagination control. Clicking a number scrolls to that section. Clicking + appends a new blank section. 

🧩 ZONE 2: CENTER CANVAS — FORM BUILDING AREA
This area contains two side-by-side containers representing the current form structure.

➤ LEFT CONTAINER — SECTION 1 CARD
A rectangular card labeled Section 1.

▶ Header Strip (Light Blue Background)
Left Side:
Text: Section 1 — medium weight, dark gray
Right Side:
Toggle labeled Required — currently OFF (gray toggle)
Icon: Link/chain → likely for copying section ID or linking to other forms
Three-dot menu (⋯) → more actions (edit, duplicate, delete)
▶ Body Area (White Background)
Placeholder text: Title Here — centered, medium gray, slightly larger font
Below it: three horizontal dots (...) — indicates placeholder for fields/content
Slight drop shadow around card → gives depth
✅ WindSurf AI Note: This is a draggable/droppable container. Users can click to edit title, toggle required, or add fields inside. 

➤ RIGHT CONTAINER — DRAG & DROP ZONE
A large empty rectangle with:

Dotted border (light gray dashes)
Centered text: Drag or Drop — medium gray, sans-serif
Light background color (#F5F7FA) — same as canvas background
✅ WindSurf AI Note: This is a drop target zone. Users can drag elements (fields, sections, widgets) from a palette (not shown here) and drop them into this area to build the form. 

🖱️ DESIGN PATTERNS & STYLING NOTES
🎨 Color Palette
Canvas Background: #F5F7FA (very light gray)
Section Card Header: #E6F2FF (light sky blue)
Section Card Body: White (#FFFFFF)
Drag Zone Border: Dotted gray (#CCCCCC)
Active Tab Underline: Blue (#0066CC)
Save Button: Teal (#007A7A)
Text: Dark gray (#333333) for titles, medium gray (#666666) for labels
📐 Spacing & Layout
All components follow an 8px grid system
Section cards have generous padding (16–24px)
Vertical spacing between elements is consistent
Cards are horizontally aligned with equal width (~50% each)
🖋️ Typography
Headings: Bold, Inter/SF Pro, 16–18pt
Labels: Regular, 14pt
Placeholder text: Medium weight, 16pt
⚙️ Behavior & Interaction
Clicking Section 1 → opens editor or focuses it
Toggling Required → marks section as mandatory
Dragging element into Drag or Drop zone → inserts it into form
Clicking section number in sidebar → jumps to that section
Clicking + at bottom → adds new section after last one
✅ IMPLEMENTATION INSTRUCTIONS FOR WINDSURF AI
Use this structure to generate code/components that mirror this design exactly. 

Step 1: Main Container Structure
jsx
<FormBuilder>
  <HeaderBar>
    <Title>Student Leave Request Form (Sydney Campus)</Title>
    <FormID>FID 1234 5668 9869</FormID>
    <BackButton />
    <ActionButtons>
      <ImportJSON />
      <Publish />
      <Save />
      <MoreMenu />
    </ActionButtons>
  </HeaderBar>

  <TabsNav activeTab="Builder">
    {['Details', 'Identities', 'Builder', 'Settings', 'Embed', 'Theme', 'PDF Filler', 'API Mappings', 'Workflow', 'Digest'].map(tab => (
      <Tab key={tab} label={tab} />
    ))}
  </TabsNav>

  <MainCanvas>
    <SidebarNavigator />
    <FormBuilderArea />
  </MainCanvas>
</FormBuilder>

Step 2: Sidebar Navigator Component
<SidebarNavigator>
  <Toolbar>
    <UndoButton />
    <RedoButton />
  </Toolbar>

  <SectionList>
    {Array.from({ length: 7 }, (_, i) => (
      <SectionNumber key={i} number={String(i + 1).padStart(2, '0')} />
    ))}
    <ExpandButton /> {/* shows more sections */}
    <JumpToSectionInput value="100" />
  </SectionList>
</SidebarNavigator>

Step 3: Section Card Component 
<SectionCard id="section-1">
  <SectionHeader>
    <Title>Section 1</Title>
    <Actions>
      <Toggle label="Required" />
      <LinkIcon />
      <MoreMenu />
    </Actions>
  </SectionHeader>
  <SectionBody>
    <Placeholder>Title Here</Placeholder>
    <FieldPlaceholder>...</FieldPlaceholder>
  </SectionBody>
</SectionCard>

Step 4: Drag & Drop Zone
<DropZone>
  <Text>Drag or Drop</Text>
</DropZone>
 BEHAVIORAL LOGIC TO IMPLEMENT
Click “Section 1”
Focuses section, may open inline editor
Toggle “Required”
Marks section as mandatory (affects validation later)
Drag field into “Drag or Drop”
Inserts field into form structure
Click section number in sidebar
Scrolls to and highlights that section
Click “+” at bottom
Appends new blank section
Click “Save”
Serializes form structure to JSON and saves
Click “Publish”
Makes form available for public use

FORM 2
This is a form builder interface for creating/editing a “Student Leave Request Form (Sydney Campus)”. The user is currently in the “Builder” tab, assembling sections and fields visually. The interface follows a vertical stack layout with drag-and-drop or add/delete functionality for form sections.

🧭 INTERFACE LAYOUT & NAVIGATION
🔹 Top Header Bar
Title: Student Leave Request Form (Sydney Campus) — bold, dark blue text.
Form ID: FID 1234 5668 9869 — smaller gray text beneath title.
Navigation Tabs (horizontal, left-aligned):
Details
Identities
Builder ← CURRENTLY ACTIVE (underlined in blue)
Settings
Embed
Theme
PDF Filler
API Mappings
Workflow
Digest
Right-side Action Buttons:
Import JSON — white button with icon
Publish — white button
Save — dark teal button (primary action)
Three-dot menu (...) for more options
📐 MAIN CONTENT AREA — FORM BUILDER CANVAS
The canvas displays a vertically stacked list of form sections, each represented as a rectangular card. There are three identical section cards visible, followed by an “End” marker.

🧩 SECTION CARD COMPONENT (REPEATED 3x)
Each section card has the following structure:

➤ Header Bar (Top Strip)
Left Side:
Placeholder text: :: Group Title — light gray, italicized, with two colons before it.
Right Side:
Toggle labeled Required — default OFF (gray toggle)
Green circular button with + icon → likely adds field/element inside this group
Icon for “duplicate” (two overlapping squares)
Icon for “delete” (trash can)
Three-dot menu (⋯) for more actions
➤ Body Area
Large empty rectangle with light mint-green background and subtle dotted grid pattern (like graph paper).
This is the content area where form fields (text inputs, dropdowns, etc.) will be placed.
Currently empty — placeholder state.
➤ Vertical Connector
Between each section card: a blue vertical line with a small plus-circle (+) in the center.
This indicates you can insert a new section between existing ones.
Clicking the + likely opens a modal or inserts a new blank section.
🛑 END MARKER
At the bottom of the form stack:

A single horizontal bar labeled End — centered, gray background, medium gray text.
Slightly rounded corners.
This signifies the end of the form structure — no more sections can be added below unless explicitly triggered.
🖱️ LEFT SIDEBAR — SECTION NAVIGATOR / ADDER
A narrow vertical panel on the left side with icons and numbers:

Top Icons (from top to bottom):
Refresh icon (🔄) — likely reloads or resets view
Undo/Redo arrows (↩️ ↪️)
Lock icon (🔒) — possibly locks/unlocks editing
Minus circle (➖) — collapse/hide sidebar?
Section Number List:
Displays numbered boxes: 01, 02, 03, 04, 05, 06, 07
Each number is in a small square with a border.
01 is highlighted with a teal border and filled background — indicating active selection.
Below 07: a downward arrow (🔻) — likely expands to show more sections (e.g., 08–100)
Then 100 appears with minus/plus buttons around it — suggests pagination or jump-to-section.
➕ ADD ELEMENTS BUTTON
Floating action button in the top-right corner of the main canvas.
Circular button with + icon.
Label: Add Elements — positioned to the right of the button.
Function: Opens a menu or panel to insert new section types, fields, or widgets into the form.
🎨 DESIGN PATTERNS & STYLING NOTES
Color Palette:
Background: Light gray (#F5F7FA)
Section headers: Mint green (#E6FFF6)
Active tab: Blue underline
Save button: Teal (#007A7A)
Text: Dark gray/black for titles, lighter gray for labels
Icons: Mostly monochrome (black or gray), except green + buttons
Typography:
Headings: Bold sans-serif (likely Inter or SF Pro)
Body/labels: Regular weight, slightly smaller font size
Spacing & Layout:
Generous padding within cards
Consistent vertical spacing between sections
All elements aligned to a 8px or 12px grid system
Interactivity Cues:
Hover states implied (not shown but expected): buttons glow, toggles animate, sections highlight on select
Drag handles may exist (not visible here) for reordering sections
✅ IMPLEMENTATION INSTRUCTIONS FOR WINDSURF AI
Use this structure to generate code/components that mirror this design exactly. 

Step 1: Create Main Container
<FormBuilderContainer>
  <HeaderBar />
  <TabsNav />
  <CanvasArea />
  <SidebarNavigator />
</FormBuilderContainer>
Step 2: Build Section Card Component
<SectionCard id="section-01">
  <SectionHeader>
    <Title>:: Group Title</Title>
    <Actions>
      <Toggle label="Required" />
      <Button icon="+" onClick={addField} />
      <Button icon="copy" onClick={duplicateSection} />
      <Button icon="delete" onClick={deleteSection} />
      <MoreMenu />
    </Actions>
  </SectionHeader>
  <SectionBody>
    {/* Dotted grid background */}
    {/* Empty space for fields */}
  </SectionBody>
</SectionCard>
profile
Qwen3-Max
11:26 am
Absolutely! Here's a clear, vivid, and structured description of the Figma design you’ve shared — optimized for WindSurf AI (or any form builder/AI implementation engine) to accurately reconstruct this UI with proper hierarchy, components, and behavior.

🎯 OVERALL PURPOSE
This is a form builder interface for creating/editing a “Student Leave Request Form (Sydney Campus)”. The user is currently in the “Builder” tab, assembling sections and fields visually. The interface follows a vertical stack layout with drag-and-drop or add/delete functionality for form sections.

🧭 INTERFACE LAYOUT & NAVIGATION
🔹 Top Header Bar
Title: Student Leave Request Form (Sydney Campus) — bold, dark blue text.
Form ID: FID 1234 5668 9869 — smaller gray text beneath title.
Navigation Tabs (horizontal, left-aligned):
Details
Identities
Builder ← CURRENTLY ACTIVE (underlined in blue)
Settings
Embed
Theme
PDF Filler
API Mappings
Workflow
Digest
Right-side Action Buttons:
Import JSON — white button with icon
Publish — white button
Save — dark teal button (primary action)
Three-dot menu (...) for more options
📐 MAIN CONTENT AREA — FORM BUILDER CANVAS
The canvas displays a vertically stacked list of form sections, each represented as a rectangular card. There are three identical section cards visible, followed by an “End” marker.

🧩 SECTION CARD COMPONENT (REPEATED 3x)
Each section card has the following structure:

➤ Header Bar (Top Strip)
Left Side:
Placeholder text: :: Group Title — light gray, italicized, with two colons before it.
Right Side:
Toggle labeled Required — default OFF (gray toggle)
Green circular button with + icon → likely adds field/element inside this group
Icon for “duplicate” (two overlapping squares)
Icon for “delete” (trash can)
Three-dot menu (⋯) for more actions
➤ Body Area
Large empty rectangle with light mint-green background and subtle dotted grid pattern (like graph paper).
This is the content area where form fields (text inputs, dropdowns, etc.) will be placed.
Currently empty — placeholder state.
➤ Vertical Connector
Between each section card: a blue vertical line with a small plus-circle (+) in the center.
This indicates you can insert a new section between existing ones.
Clicking the + likely opens a modal or inserts a new blank section.
🛑 END MARKER
At the bottom of the form stack:

A single horizontal bar labeled End — centered, gray background, medium gray text.
Slightly rounded corners.
This signifies the end of the form structure — no more sections can be added below unless explicitly triggered.
🖱️ LEFT SIDEBAR — SECTION NAVIGATOR / ADDER
A narrow vertical panel on the left side with icons and numbers:

Top Icons (from top to bottom):
Refresh icon (🔄) — likely reloads or resets view
Undo/Redo arrows (↩️ ↪️)
Lock icon (🔒) — possibly locks/unlocks editing
Minus circle (➖) — collapse/hide sidebar?
Section Number List:
Displays numbered boxes: 01, 02, 03, 04, 05, 06, 07
Each number is in a small square with a border.
01 is highlighted with a teal border and filled background — indicating active selection.
Below 07: a downward arrow (🔻) — likely expands to show more sections (e.g., 08–100)
Then 100 appears with minus/plus buttons around it — suggests pagination or jump-to-section.
➕ ADD ELEMENTS BUTTON
Floating action button in the top-right corner of the main canvas.
Circular button with + icon.
Label: Add Elements — positioned to the right of the button.
Function: Opens a menu or panel to insert new section types, fields, or widgets into the form.
🎨 DESIGN PATTERNS & STYLING NOTES
Color Palette:
Background: Light gray (#F5F7FA)
Section headers: Mint green (#E6FFF6)
Active tab: Blue underline
Save button: Teal (#007A7A)
Text: Dark gray/black for titles, lighter gray for labels
Icons: Mostly monochrome (black or gray), except green + buttons
Typography:
Headings: Bold sans-serif (likely Inter or SF Pro)
Body/labels: Regular weight, slightly smaller font size
Spacing & Layout:
Generous padding within cards
Consistent vertical spacing between sections
All elements aligned to a 8px or 12px grid system
Interactivity Cues:
Hover states implied (not shown but expected): buttons glow, toggles animate, sections highlight on select
Drag handles may exist (not visible here) for reordering sections
✅ IMPLEMENTATION INSTRUCTIONS FOR WINDSURF AI
Use this structure to generate code/components that mirror this design exactly. 

Step 1: Create Main Container
jsx

<FormBuilderContainer>
  <HeaderBar />
  <TabsNav />
  <CanvasArea />
  <SidebarNavigator />
</FormBuilderContainer>
Step 2: Build Section Card Component
jsx
<SectionCard id="section-01">
  <SectionHeader>
    <Title>:: Group Title</Title>
    <Actions>
      <Toggle label="Required" />
      <Button icon="+" onClick={addField} />
      <Button icon="copy" onClick={duplicateSection} />
      <Button icon="delete" onClick={deleteSection} />
      <MoreMenu />
    </Actions>
  </SectionHeader>
  <SectionBody>
    {/* Dotted grid background */}
    {/* Empty space for fields */}
  </SectionBody>
</SectionCard>
Step 3: Add Connectors Between Sections
<VerticalConnector>
  <PlusCircle onClick={insertSection} />
</VerticalConnector>
Step 4: Render End Marker
<EndMarker>End</EndMarker>
Step 5: Sidebar Navigator
<Sidebar>
  <IconRow>
    <RefreshButton />
    <UndoRedoButtons />
    <LockButton />
  </IconRow>
  <SectionList>
    {sections.map((sec, i) => (
      <SectionNumber key={i} isActive={i === 0}>
        {String(i + 1).padStart(2, '0')}
      </SectionNumber>
    ))}
    <ExpandButton /> {/* shows more numbers */}
    <JumpToSectionInput value="100" />
  </SectionList>
</Sidebar>
Step 6: Add Elements Button (Floating)
jsx
<FloatingActionButton onClick={openElementPicker}>
  +
</FloatingActionButton>
 BEHAVIORAL NOTES
Clicking + inside section header → opens field picker (text, date, dropdown, etc.)
Clicking + between sections → inserts new blank section at that position
Clicking section number in sidebar → scrolls to and highlights that section
Toggling “Required” → marks entire section as mandatory (may affect validation later)
Save button → triggers form serialization/export
Publish → makes form live/public


FORM 3
This is the Builder view of a Student Leave Request Form (Sydney Campus). The user is actively constructing or editing the form by dragging pre-defined fields from a right-side Elements panel into the main canvas. The interface follows a two-column layout: left = form canvas, right = field library.

🧭 INTERFACE LAYOUT — TOP NAVIGATION & HEADER
🔹 Top Header Bar
Title: Student Leave Request Form (Sydney Campus) — bold, dark blue text.
Form ID: FID 1234 5668 9869 — smaller gray text directly beneath title.
Back Arrow (←) — top-left corner, allows returning to previous screen.
Action Buttons (Top Right):
Import JSON — white button with cloud+arrow icon → imports form structure from JSON.
Publish — white button → makes form live/public.
Save — dark teal button (primary action) → saves current state.
Three-dot menu (...) → additional options (e.g., export, settings).
🔹 Tab Navigation Bar (Below Header)
Horizontal tab list with:

Details
Identities
Builder ← CURRENTLY ACTIVE (underlined in blue)
Settings
Embed
Theme
PDF Filler
API Mappings
Workflow
Digest
✅ WindSurf AI Note: Only “Builder” tab is active; others are inactive but clickable. 

📐 MAIN CONTENT AREA — TWO-COLUMN LAYOUT
The canvas is divided into two vertical zones:

🧩 ZONE 1: LEFT PANEL — FORM CANVAS + SECTION NAVIGATOR
A narrow vertical sidebar on the far left with two functional areas:

➤ Top Toolbar Icons
Two circular buttons stacked vertically:
Undo (↩️) — top button
Redo (↪️) — bottom button
Both have subtle borders and hover states implied.
➤ Section Number List
A vertical stack of numbered boxes: 01, 02, 03, 04, 05, 06, 07
Each number is centered inside a small square with light border.
01 is highlighted with a teal border and filled background — indicating active selection.
Below 07: a downward arrow (🔻) — indicates more sections exist beyond 07 (expandable).
At the very bottom:
A minus button (−)
A number field showing 100 — likely total sections or jump-to-section input.
A plus button (+) — adds new section at end.
✅ WindSurf AI Note: This is a section index + pagination control. Clicking a number scrolls to that section. Clicking + appends a new blank section. 

🧩 ZONE 2: CENTER CANVAS — FORM BUILDING AREA
This area contains one large section card labeled Group Title 1, which holds multiple form fields.

➤ SECTION CARD — “Group Title 1”
A rectangular container with a light green border and white background, representing a grouped set of fields.

▶ Header Strip (Light Green Background)
Left Side:
Text: :: Group Title 1 — medium weight, dark gray, with two colons before it.
Right Side:
Toggle labeled Required — currently OFF (gray toggle)
Green circular button with + icon → likely adds field/element inside this group
Icon for “duplicate” (two overlapping squares)
Icon for “delete” (trash can)
Three-dot menu (⋯) for more actions
▶ Body Area (White Background)
Contains five distinct form fields, each with its own header row and input area.

📋 FIELD 1: Last Name
Header Row:
Label: Last Name — dark gray, left-aligned
Toggle: Full — OFF (gray toggle) → likely controls field width (full vs half column)
Toggle: Required — OFF (gray toggle)
Icons: Link, Duplicate, Delete, More Menu
Input Area:
Empty text input box (placeholder not visible, but implied)
📋 FIELD 2: Do you have residency?
Header Row:
Label: Do you have residency?
Toggles: Full OFF, Required OFF
Icons: same as above
Input Area:
Radio buttons:
○ Yes
○ No
Vertical alignment, left-aligned
📋 FIELD 3: Email Address
Header Row:
Label: Email Address
Toggles: Full OFF, Required OFF
Icons: same
Input Area:
Dropdown selector with placeholder: Select Title Here
Down arrow icon on right → indicates dropdown
📋 FIELD 4: Salutation
Header Row:
Label: Salutation
Toggles: Full OFF, Required OFF
Icons: same
Input Area:
Checkbox list:
☐ Mr
☐ Mrs
☐ Alhaji
☐ Dr
Vertical alignment, left-aligned
📋 FIELD 5: Photo
Header Row:
Label: Photo
Toggles: Full OFF, Required OFF
Icons: same
Input Area:
Large upload zone with:
Blue folder icon centered
Text: Drag your image to start uploading
Subtext: JPEG, PNG and GIF formats
Button: Browse files — small rounded rectangle below
➤ END MARKER
At the bottom of the form stack:

A single horizontal bar labeled End — centered, gray background, medium gray text.
Slightly rounded corners.
This signifies the end of the form structure — no more sections can be added below unless explicitly triggered.
🧩 ZONE 3: RIGHT PANEL — ELEMENTS LIBRARY
A floating or docked panel titled “Elements”, with tabs and searchable list of reusable fields.

➤ Panel Header
Close button (X) — top-left
Title: Elements
Tabs:
Standard Fields ← CURRENTLY ACTIVE
Custom Fields — inactive
➤ Search Bar
Placeholder: Search — with magnifying glass icon
Full-width input field
➤ Field Categories (Collapsible Sections)
Each category has a title and checkbox list of available fields.

🟢 PRF - Account Profile
Collapsed by default? No — expanded in screenshot.
Fields (each with checkbox):
☐ Photo
☐ State
☐ Gender
☐ Email Address
☐ Last Name
☑ Date of Birth → selected/highlighted
☑ Do you have residency? → selected
☑ Salutation → selected
☑ Mobile Number → selected
☑ First Name → selected
✅ WindSurf AI Note: Checked fields indicate they’re already used in the form. Unchecked = available to drag in. 

🟡 BIO - Biodata
Collapsed (down arrow visible)
Likely contains: Date of Birth, Nationality, etc.
🟠 CON - Contact Info
Collapsed
Likely contains: Phone, Address, Emergency Contact
🔵 PAS - Passports
Collapsed
Likely contains: Passport Number, Expiry Date
🔴 IDC - ID Cards
Collapsed
Likely contains: Student ID, Driver’s License
✅ WindSurf AI Note: These are collapsible categories. Clicking title expands/collapses list. Fields can be dragged into form canvas. 

🖱️ DESIGN PATTERNS & STYLING NOTES
🎨 Color Palette
Canvas Background: #F5F7FA (very light gray)
Section Card Border: Light green (#E6FFF6)
Field Headers: Light gray background (#F0F2F5)
Selected Field Highlight: Light mint green (#E6FFF6) — e.g., “Date of Birth” in Elements panel
Active Tab Underline: Blue (#0066CC)
Save Button: Teal (#007A7A)
Text: Dark gray (#333333) for titles, medium gray (#666666) for labels
📐 Spacing & Layout
All components follow an 8px grid system
Section cards have generous padding (16–24px)
Vertical spacing between elements is consistent
Fields are stacked vertically with uniform height
🖋️ Typography
Headings: Bold, Inter/SF Pro, 16–18pt
Labels: Regular, 14pt
Placeholder text: Medium weight, 16pt
⚙️ Behavior & Interaction
Clicking field in Elements panel → drags it into form canvas
Dragging field over canvas → highlights drop zone
Dropping field → inserts it into current section or creates new section
Clicking section number in sidebar → jumps to that section
Clicking + at bottom → adds new section after last one
Toggling Required → marks field as mandatory
Clicking Full → toggles field width (half vs full column)
✅ IMPLEMENTATION INSTRUCTIONS FOR WINDSURF AI
Use this structure to generate code/components that mirror this design exactly. 

Step 1: Main Container Structure
jsx


<FormBuilder>
  <HeaderBar />
  <TabsNav activeTab="Builder" />
  <MainCanvas>
    <SidebarNavigator />
    <FormBuilderArea />
    <ElementsPanel />
  </MainCanvas>
</FormBuilder>
Step 2: Sidebar Navigator Component
jsx

<SidebarNavigator>
  <Toolbar>
    <UndoButton />
    <RedoButton />
  </Toolbar>

  <SectionList>
    {Array.from({ length: 7 }, (_, i) => (
      <SectionNumber key={i} number={String(i + 1).padStart(2, '0')} isActive={i === 0} />
    ))}
    <ExpandButton /> {/* shows more sections */}
    <JumpToSectionInput value="100" />
  </SectionList>
</SidebarNavigator>
Step 3: Section Card Component
jsx

<SectionCard id="group-1">
  <SectionHeader>
    <Title>:: Group Title 1</Title>
    <Actions>
      <Toggle label="Required" />
      <AddFieldButton />
      <DuplicateButton />
      <DeleteButton />
      <MoreMenu />
    </Actions>
  </SectionHeader>
  <SectionBody>
    <FieldRow label="Last Name">
      <Toggle label="Full" />
      <Toggle label="Required" />
      <Icons />
      <TextInput />
    </FieldRow>

    <FieldRow label="Do you have residency?">
      <Toggle label="Full" />
      <Toggle label="Required" />
      <Icons />
      <RadioGroup>
        <RadioButton value="Yes">Yes</RadioButton>
        <RadioButton value="No">No</RadioButton>
      </RadioGroup>
    </FieldRow>

    <FieldRow label="Email Address">
      <Toggle label="Full" />
      <Toggle label="Required" />
      <Icons />
      <Dropdown placeholder="Select Title Here" />
    </FieldRow>

    <FieldRow label="Salutation">
      <Toggle label="Full" />
      <Toggle label="Required" />
      <Icons />
      <CheckboxGroup>
        <Checkbox value="Mr">Mr</Checkbox>
        <Checkbox value="Mrs">Mrs</Checkbox>
        <Checkbox value="Alhaji">Alhaji</Checkbox>
        <Checkbox value="Dr">Dr</Checkbox>
      </CheckboxGroup>
    </FieldRow>

    <FieldRow label="Photo">
      <Toggle label="Full" />
      <Toggle label="Required" />
      <Icons />
      <FileUploadZone>
        <Icon />
        <Text>Drag your image to start uploading</Text>
        <Subtext>JPEG, PNG and GIF formats</Subtext>
        <BrowseButton>Browse files</BrowseButton>
      </FileUploadZone>
    </FieldRow>
  </SectionBody>
</SectionCard>
Step 4: Elements Panel Component
jsx
<ElementsPanel>
  <PanelHeader>
    <CloseButton />
    <Title>Elements</Title>
    <Tabs>
      <Tab label="Standard Fields" isActive />
      <Tab label="Custom Fields" />
    </Tabs>
  </PanelHeader>

  <SearchBar placeholder="Search" />

  <CategorySection title="PRF - Account Profile" isOpen>
    <FieldItem label="Photo" />
    <FieldItem label="State" />
    <FieldItem label="Gender" />
    <FieldItem label="Email Address" />
    <FieldItem label="Last Name" />
    <FieldItem label="Date of Birth" isSelected />
    <FieldItem label="Do you have residency?" isSelected />
    <FieldItem label="Salutation" isSelected />
    <FieldItem label="Mobile Number" isSelected />
    <FieldItem label="First Name" isSelected />
  </CategorySection>

  <CategorySection title="BIO - Biodata" isCollapsed />
  <CategorySection title="CON - Contact Info" isCollapsed />
  <CategorySection title="PAS - Passports" isCollapsed />
  <CategorySection title="IDC - ID Cards" isCollapsed />
</ElementsPanel>
🔄 BEHAVIORAL LOGIC TO IMPLEMENT
Click field in Elements panel
Initiates drag operation
Drag field over canvas
Highlights drop zone (green border)
Drop field
Inserts into current section or creates new section
Click “Required” toggle
Marks field as mandatory
Click “Full” toggle
Toggles field width (half vs full column)
Click section number in sidebar
Scrolls to and highlights that section
Click “+” at bottom
Appends new blank section
Click “Save”
Serializes form structure to JSON and saves
Click “Publish”
Makes form available for public use

📌 FINAL CHECKLIST FOR WINDSURF AI
✅ Replicate all visual styling (colors, fonts, spacing)
✅ Build two-column layout: Form Canvas + Elements Panel
✅ Implement section navigator with undo/redo and section numbers
✅ Add drag-and-drop functionality from Elements to Canvas
✅ Support toggling “Required” and “Full” per field
✅ Include Save/Publish/Import buttons with correct styling
✅ Ensure responsive layout (mobile/tablet-friendly if needed)
✅ Mirror interaction patterns (hover, click, drag)


