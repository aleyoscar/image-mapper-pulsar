'use babel';

import ImageMapperMap from './image-mapper-map';
import { CompositeDisposable } from 'atom';

export default {

	imageMapperView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.mapper = new ImageMapperMap();
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'image-mapper:map': () => this.map()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
		this.mapper.destroy();
	},

	serialize() {},

	export(coords) {
		const promise = atom.workspace.open();
		promise.then((newEditor) => {
			newEditor.getBuffer().setText(coords);
		}).catch((error) => {
			atom.notifications.addError(`Error opening new file.`, {
				detail: error,
				dismissable: true
			});
		});
	},

	map() {
		let item = atom.workspace.getActivePaneItem();
		if(item.constructor.name == "ImageEditor") {
			if(this.mapper.active) {
				if(this.mapper.list.length > 0) {
					let output = this.mapper.print_list();
					let notificationEnd = atom.notifications.addSuccess(this.mapper.list.length + ' coordinates mapped.', {
						detail: output,
						dismissable: true,
						buttons: [
							{
								text: "Export",
								onDidClick: () => { this.export(output); notificationEnd.dismiss(); }
							}
						]
					});
				} else {
					atom.notifications.addInfo("No coordinates mapped.");
				}
				this.mapper.destroy();
			} else {
				let e = item.editorView.element.querySelector('img');
				if(e) {
					atom.notifications.addInfo("Started mapping.", {
						detail: "Run command again to stop."
					});
					this.mapper.setup(item);
				} else {
					atom.notifications.addInfo('No image found.');
					return;
				}
			}
		} else {
			atom.notifications.addInfo('Not an image.');
			return;
		}
	}

};
