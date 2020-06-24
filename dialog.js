const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => context.querySelectorAll(selector);


class Modal extends HTMLElement {
static get is () {return "html-dialog";}
static get observedAttributes () {
return ["open", "title", "description", "return"]
} // get observedAttributes


static get template () {
return `<div role="document" class="wrapper" style="position:relative;">
<div hidden role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" style="position:absolute; width:90% height:90% zindex:10;">
<header>
<h2 id="dialog-title"></h2>
<button id="close">Close</button>
</header>

<div id="dialog-description"></div>

<div class="body">
<slot></slot>
</div><!-- .body -->
</div><!-- dialog role -->
</div><!-- dialog wrapper -->
`;
} // get template

constructor () {
super ();
console.debug("constructor...");

//this._observer = new MutationObserver(() => {
    //});
} // constructor
  
connectedCallback () {
console.debug("connectedCallback...");
this._modal = this.instantiateTemplate();
if (!this._modal) return;


this._modal.addEventListener("keydown", e => {
if (e.target === $("#close", this.shadowRoot) && e.key === "Escape" && !e.altKey && !e.ctrlKey && !e.shiftKey) this.removeAttribute("open");
});

this._modal.addEventListener("click", e => {
if (e.target === $("#close", this.shadowRoot)) this.removeAttribute("open");
}); // click #close

if (this.hasAttribute("open")) this._open(true);
} // connectedCallback

instantiateTemplate () {
	console.debug("instantiateTemplate...");
const root = this.attachShadow({mode: "open"});
if (!root) return null;

 const div = document.createElement("div");
div.innerHTML = Modal.template;
root.appendChild(div.children[0].cloneNode(true));

return root;
} // instantiateTemplate

_close () {
if (this.shadowRoot) {
	$("[role=dialog]", this.shadowRoot).hidden = true;
if (this._returnFocus) this._returnFocus.focus();
} // if
} // _close


disconnectedCallback() {
    } // disconnectedCallback


  attributeChangedCallback(name, oldValue, value) {
console.debug(`changed: ${name} to ${value}`);
switch (name) {
case "open": this._open(this.hasAttribute("open")); return;
} // switch
} // attributeChangedCallback

_open (value) {
console.debug(`_open: ${value}`);
$("[role=dialog]", this.shadowRoot).hidden = !value;

if (value) {
$("#dialog-title", this.shadowRoot).textContent = this.getAttribute("title");
$("#dialog-description", this.shadowRoot).textContent = this.getAttribute("description");
$("#close", this.shadowRoot).focus();
} else {
this._close();
} // if
} // _open

_close () {
console.debug("_close: ", this);
if (this.hasAttribute("return")) $(this.getAttribute("return")).focus();
} // _close

} // class HtmlDialog

customElements.define(Modal.is, Modal);

