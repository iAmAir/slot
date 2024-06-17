# @slot/machine-item

## Description

Инстанс элемента. Является Graphics-объектом, чтобы в будущем добавить какие-нибудь рамки, и прочее.
Его размером можно управлять через style, а именно: style.width и style.height. 
Текстурой - с помощью style.texture

## Usage

```js
import { Texture } from 'pixi.js';
import { MachineItem } from '@slot/machine-item';

const machineItem = new Machine({
	width: 100,
	height: 100,
	texture: Texture.WHITE
});
```