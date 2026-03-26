export default {
  name: 'product',
  title: 'Collectibles',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'price', title: 'Price (₦)', type: 'number' },
    { name: 'section', title: 'Section', type: 'string', options: { list: ['premium', 'characters', 'accessories'] } },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'heights', title: 'Heights', type: 'array', of: [{type: 'string'}] },
    { name: 'colors', title: 'Colors', type: 'array', of: [{type: 'string'}] },
  ]
}