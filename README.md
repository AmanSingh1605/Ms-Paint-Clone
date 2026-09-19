
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
- There are 4 types of brushes in which user can change the brush width except Caligraphy brush.

### Brush Width
- There are 4 option for brush width. More will be added in future, stay tuned.

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
    canvas/              painting, cursor, setup, paper resize
  lib/          pure logic, no React and no DOM assumptions
    canvas/       rectangle maths, event -> canvas coordinates
    shapes/       shape enum + the geometry table
    tools/        fill, picker, calligraphy, clipboard
    text/         text rasterisation
  state/        ColorContext, ToolContext, PaperContext
  types/        ambient declarations
```

Two ideas carry most of the design:

- **One geometry table.** Every shape is a function of the drag rectangle
  (`lib/shapes/geometry.ts`). The SVG preview and the committed canvas stroke
  both read it, so they cannot disagree, and adding a shape means adding one
  entry rather than a new component.
- **One interaction hook.** `useDragInteraction` owns drag-to-size, the eight
  resize handles and moving. The shape, selection and text overlays share it.

## Contribution
If you have any good ideas, please do contribute in this project.

## Upcoming Feature
- Add themes
- Selection Rotate tool
- Revert the changes using Ctrl + Z.
