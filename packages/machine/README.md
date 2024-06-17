# @slot/machine

## Description

Основной инстанс-приложения. С его помощью создается сетка.
К нему идут два миксина - animationMixin и resultMixin. Первый отвечает за анимацию прокрутки, а второй - за подсветку результатов и просчет кластеров

## Usage

```js
import { Texture } from 'pixi.js';
import { Machine } from '@slot/machine';

const items = [
	{
		id: "0",
		texture: Texture.WHITE
	}
]
const machine = new Machine({
	row: 3,
	col: 3,
	items
}, {
	itemWidth: 100,
	itemHeight: 100
});
```