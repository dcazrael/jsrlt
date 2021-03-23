// ---------- Base>> ---------- //
export const Tile = {
  name: 'Tile',
  components: [
    { type: 'Appearance' },
    { type: 'Description' },
    { type: 'Layer100' },
  ],
};

export const Being = {
  name: 'Being',
  components: [
    { type: 'Appearance' },
    { type: 'Defense' },
    { type: 'Description' },
    { type: 'Health' },
    { type: 'IsBlocking' },
    { type: 'Layer400' },
    { type: 'Power' },
  ],
};

export const Item = {
  name: 'Item',
  components: [
    { type: 'Appearance' },
    { type: 'Description' },
    { type: 'Layer300' },
    { type: 'IsPickup' },
  ],
};
// ---------- <<Base ---------- //

// ---------- Complex>> ---------- //
// ---------- Tiles> ---------- //
export const Wall = {
  name: 'Wall',
  inherit: ['Tile'],
  components: [
    { type: 'IsBlocking' },
    { type: 'IsOpaque' },
    {
      type: 'Appearance',
      properties: { char: '#', color: '#AAA' },
    },
    {
      type: 'Description',
      properties: { name: 'wall' },
    },
  ],
};

export const Floor = {
  name: 'Floor',
  inherit: ['Tile'],
  components: [
    {
      type: 'Appearance',
      properties: { char: '•', color: '#555' },
    },
    {
      type: 'Description',
      properties: { name: 'floor' },
    },
  ],
};
// ---------- <Tiles ---------- //

// ---------- Beings> ---------- //
export const Player = {
  name: 'Player',
  inherit: ['Being'],
  components: [
    { type: 'Appearance', properties: { char: '@', color: '#FFF' } },
    { type: 'Description', properties: { name: 'You' } },
    { type: 'Health', properties: { current: 12, max: 20 } },
    { type: 'Inventory' },
  ],
};

export const Goblin = {
  name: 'Goblin',
  inherit: ['Being'],
  components: [
    { type: 'Ai' },
    {
      type: 'Appearance',
      properties: { char: 'g', color: 'green' },
    },
    {
      type: 'Description',
      properties: { name: 'goblin' },
    },
  ],
};
// ---------- <Beings ---------- //

// ---------- Items> ---------- //
export const HealthPotion = {
  name: 'HealthPotion',
  inherit: ['Item'],
  components: [
    {
      type: 'Appearance',
      properties: { char: '!', color: '#DAA520' },
    },
    {
      type: 'Description',
      properties: { name: 'health potion' },
    },
    {
      type: 'Effects',
      properties: {
        component: 'health',
        delta: 5,
        animate: { color: '#ff0000', char: '♥' },
      },
    },
  ],
};

export const ManaPotion = {
  name: 'ManaPotion',
  inherit: ['Item'],
  components: [
    {
      type: 'Appearance',
      properties: { char: '&', color: '#12A520' },
    },
    {
      type: 'Description',
      properties: { name: 'mana potion' },
    },
  ],
};
// ---------- <Items ---------- //
// ---------- <<Complex ---------- //
