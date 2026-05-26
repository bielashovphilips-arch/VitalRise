# VitalRise exercise photo backlog

Усі пріоритетні фото з `README.md` зараз підключені в `assets/js/modules/exercise-atlas-data.js`.

## Пріоритетні вправи без окремого фото

Поки список порожній.

## Як підключити нове фото

1. Поклади файл у `assets/images/exercises/`.
2. Додай рядок у `exerciseAtlasImages` у `assets/js/modules/exercise-atlas-data.js`, наприклад:

```js
"Жим ногами": "assets/images/exercises/leg-press.webp"
```

3. Якщо для вправи ще немає окремої картки в `exerciseAtlas`, фото все одно відкриється через кнопку "Техніка", якщо назва вправи збігається з ключем у `exerciseAtlasImages`.
