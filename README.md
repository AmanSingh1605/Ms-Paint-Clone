
# MS Paint Clone
This project is clone of Window 7 Ms Paint Application.
Most of the MS paint functionalities are added in this application.

This application is still in construction and more features will be added in future.

Enjoy the current features in the app.
All the contribution and ideas are welcomed.

## How to Run

Run the following commands:
```bash
git clone https://github.com/AmanSingh1605/Ms-Paint-Clone
cd Ms-Paint-Clone
npm install
npm run dev  
```
# Features
### Brush
The nine brushes of Windows 7 Paint, each with its own stroke behaviour rather than just a different line cap:

| Brush | Stroke |
| --- | --- |
| Brush | plain round stroke |
| Calligraphy brush 1 / 2 | fixed nib at -45 / +45 degrees, so thickness follows direction |
| Airbrush | scattered dots, density follows distance travelled |
| Oil brush | wide body with offset passes for a loaded bristle edge |
| Crayon | opaque specks across the width, leaving paper gaps |
| Marker | wide flat translucent, darkens where strokes cross |
| Natural pencil | thin, jittered, faint |
| Watercolor brush | wide dilute wash with wandering edges |

All nine respond to the brush width.

### Brush Width
- There are 4 option for brush width. More will be added in future, stay tuned.

### Undo and Redo
- **Ctrl + Z** undoes and **Ctrl + Y** redoes, up to 20 steps. **Ctrl + Shift + Z** also redoes.
- One step covers a whole gesture: a complete brush stroke, a bucket fill, a committed shape or text box, a select-cut-move-paste, or a paper resize.

### Color
- Either user can select color from preset panel or can be picked from color picker

### Fill And Stroke Color
- Fill is for background color and Stroke is primary color which will affect your brush strokes, text color and bucket fill color.

### Tool Panel
Tool panel have 6 tools in which 5 tool are currently working.  
- **Pencil**: Used to draw 1px lines on canvas
- **Bucket Fill**: Ms paint bucket fill tool, used to fill colors. Look out for gaps in closed figures😊.
- **Eraser**: Used to remove Colors, can be used to remove backgrounds. To increase the size of eraser press **Shift + I** and to decrease the size of eraser press **Shift + Y**.
- **Text**: Used to add text in canvas. Text color will be stroke and background color will be fill.
- **Picker**: Use to pick colors which only modify the Stroke color. User can get color code by using color Picker wheel.

### Select Tool
- User can select a part of drawing in canvas, can resize the select the part and can move the selected area in canvas.
- If clicked outside it will print the selection on canvas.

## Project Structure

```
src/
  app/          Next.js routing, global styles
  components/   UI only
    canvas/       the paper, its resize grips, eraser cursor
    overlays/     shape / selection / text overlays
    toolbar/      panels and dropdown menus
    ui/           shared pieces (resize handles)
  hooks/        reusable behaviour
    useDragInteraction   drag-to-size, resize, move (shared by all 3 overlays)
    useWindowEvent       leak-proof listener subscription
    canvas/              painting, cursor, setup, paper resize, undo history
  lib/          pure logic, no React and no DOM assumptions
    brushes/      the brush registry and its painters
    canvas/       rectangle maths, event to canvas coordinates
    shapes/       shape enum and the geometry table
    tools/        fill, picker, clipboard
    text/         text rasterisation
  state/        ColorContext, ToolContext, PaperContext
  types/        ambient declarations
```

Four ideas carry most of the design:

- **One geometry table.** Every shape is a function of the drag rectangle
  (`lib/shapes/geometry.ts`). The SVG preview and the committed canvas stroke
  both read it, so they cannot disagree, and adding a shape means adding one
  entry rather than a new component.
- **One interaction hook.** `useDragInteraction` owns drag-to-size, the eight
  resize handles and moving. The shape, selection and text overlays share it.
- **One brush registry.** Each brush is a painter that draws a single segment
  (`lib/brushes/painters.ts`). Adding a brush is one function plus one entry.
- **One dropdown.** Every ribbon menu renders through `DropdownMenu`, so they
  share their padding, shadow, animation and outside-click behaviour.

## Contribution
If you have any good ideas, please do contribute in this project.

## Upcoming Feature
- Add themes
- Selection Rotate tool
- Crop, Resize and the clipboard buttons
- Airbrush should keep spraying while the pointer is held still
