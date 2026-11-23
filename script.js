const products = [
  {name:'Top Hat',price:5,emoji:'🎩',color:'#168de0'},
  {name:'Sword',price:5,emoji:'⚔️',color:'#168de0'},
  {name:'Skateboard',price:5,emoji:'🛹',color:'#168de0'},
  {name:'Guitar',price:5,emoji:'🎸',color:'#168de0'}
];

const colors = [
  {name:'Blue',hex:'#168de0'},
  {name:'Red',hex:'#e53945'},
  {name:'Christmas Green',hex:'#18864b'},
  {name:'Ivory',hex:'#f4f0df'},
  {name:'Gold',hex:'#e7b83f'},
  {name:'Purple',hex:'#a66bca'}
];

let chosenProduct = null;
let chosenColor = '#168de0';
let cart = [];

const pages = [
  'homePage',
  'detailPage',
  'cartPage',
  'checkoutPage'
];

function showPage(id){
  pages.forEach(p =>
    document.getElementById(p).classList.toggle('hidden',p!==id)
  );

  window.scrollTo(0,0);
}

function goHome(){
  showPage('homePage');
}

function renderProducts(){
  document.getElementById('productGrid').innerHTML =
    products.map((p,i)=>`
      <article class="product-card" onclick="openProduct(${i})">
        <div class="product-art">${p.emoji}</div>
        <div class="card-copy">
          <h3>${p.name}</h3>
          <p class="price">$${p.price.toFixed(2)}</p>
          <p>Personalize colors and lettering.</p>
          <button>VIEW & CUSTOMIZE</button>
        </div>
      </article>
    `).join('');
}

// PRODUCT DETAILS

function openProduct(i){
  chosenProduct = products[i];
  chosenColor = chosenProduct.color;

  document.getElementById('detailTitle').textContent =
    chosenProduct.name;

  document.getElementById('detailPrice').textContent =
    '$'+chosenProduct.price.toFixed(2);

  document.getElementById('previewEmoji').textContent =
    chosenProduct.emoji;

  document.getElementById('nameText').value = '';
  document.getElementById('qty').value = 1;
  document.getElementById('fontChoice').value = 'classic';

  renderSwatches();
  updatePreview();
  showPage('detailPage');
}

// COLOR OPTIONS

function renderSwatches(){
  document.getElementById('swatches').innerHTML =
    colors.map(c=>`
      <button
        class="swatch ${chosenColor===c.hex?'selected':''}"
        title="${c.name}"
        aria-label="${c.name}"
        style="background:${c.hex}"
        onclick="pickColor('${c.hex}')">
      </button>
    `).join('');
}

function pickColor(hex){
  chosenColor = hex;
  renderSwatches();
  updatePreview();
}

// LIVE PREVIEW

function updatePreview(){
  if(!chosenProduct)return;

  let shape = document.querySelector('.ornament-shape');

  shape.style.setProperty('--ornament-color',chosenColor);
  shape.style.background = chosenColor;

  let name = document.getElementById('previewName');

  name.textContent = document.getElementById('nameText').value;

  name.className =
    'preview-name '+document.getElementById('fontChoice').value;
}

// ADD TO CART

function addDetailToCart(){
  let qty = parseInt(document.getElementById('qty').value,10);

  if(!qty || qty<1){
    toast('Choose a valid quantity');
    return;
  }

  cart.push({
    product:chosenProduct.name,
    price:chosenProduct.price,
    emoji:chosenProduct.emoji,
    name:document.getElementById('nameText').value,
    color:chosenColor,
    font:document.getElementById('fontChoice').value,
    qty
  });

  refreshCount();
  toast('Added to cart');
  goHome();
}

// CART

function refreshCount(){
  document.getElementById('cartCount').textContent =
    cart.reduce((n,x)=>n+x.qty,0);
}

function cartSum(){
  return cart.reduce((n,x)=>n+x.price*x.qty,0);
}

function openCart(){
  if(!cart.length){
    toast('Your cart is empty');
    return;
  }

  renderCart();
  showPage('cartPage');
}

function renderCart(){
  document.getElementById('cartList').innerHTML =
    cart.map((x,i)=>`
      <div class="cart-item">
        <h3>${x.emoji} ${x.product}</h3>
        <p>Name: ${safe(x.name||'—')}</p>
        <p>Color: ${x.color}</p>
        <p>Font: ${x.font}</p>
        <p>Quantity: ${x.qty}</p>
        <strong>$${(x.price*x.qty).toFixed(2)}</strong>
        <button class="back" onclick="removeItem(${i})">Remove</button>
      </div>
    `).join('');

  document.getElementById('cartTotal').textContent =
    '$'+cartSum().toFixed(2);
}

function removeItem(i){
  cart.splice(i,1);
  refreshCount();

  if(cart.length){
    renderCart();
  }else{
    goHome();
  }
}

// CHECKOUT

function goCheckout(){
  if(!cart.length)return;

  document.getElementById('checkoutTotal').textContent =
    '$'+cartSum().toFixed(2);

  showPage('checkoutPage');
}

// DEMO ORDER

function placeDemoOrder(){
  let fields = [
    'buyerName',
    'buyerEmail',
    'street',
    'city',
    'zip'
  ];

  if(fields.some(id=>!document.getElementById(id).value.trim())){
    toast('Please complete the required fields');
    return;
  }

  toast('Demo order complete! No payment was taken.');

  cart = [];
  refreshCount();

  fields.forEach(id=>{
    document.getElementById(id).value='';
  });

  setTimeout(goHome,1300);
}

// HTML SAFETY

function safe(s){
  return String(s).replace(/[&<>"']/g,c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));
}

// NOTIFICATIONS

function toast(msg){
  let t = document.getElementById('toast');

  t.textContent = msg;
  t.style.display = 'block';

  setTimeout(()=>{
    t.style.display='none';
  },2300);
}

// INITIALIZE

renderProducts();
