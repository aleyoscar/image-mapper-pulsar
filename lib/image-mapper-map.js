'use babel';

export default class ImageMapperMap {

	constructor() {
		this.element = null;
		this.active = false;
		this.width = 0;
		this.height = 0;
		this.list = [];
		var self = this;
		this.map = function(e) {
			let mx = self.width * e.offsetX / e.target.clientWidth;
			let my = self.height * e.offsetY / e.target.clientHeight;
			self.list.push([mx, my]);
			console.log("Coordinates:", mx, my);
			atom.notifications.addInfo(mx + ',' + my);
		}
	}

	serialize() {}

	destroy() {
		this.element.removeEventListener("mousedown", this.map, true);
		this.element = null;
		this.active = false;
		this.width = 0;
		this.height = 0;
		this.list = [];
		console.log("Stopped mapping.");
	}

	setup(editor) {
		this.active = true;
		this.width = editor.editorView.originalWidth;
		this.height = editor.editorView.originalHeight;
		this.element = editor.editorView.element.querySelector("img");
		this.element.addEventListener("mousedown", this.map, true);
		console.log('Mapping coordinates.');
		console.log(this.element);
	}

	print_list() {
		if(this.list.length > 0) {
			let out = '';
			this.list.forEach((i) => {
				out += i + "\n";
			});
			return out;
		} else return 'Nan';
	}
}
