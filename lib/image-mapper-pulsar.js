'use babel';

import ImageMapperPulsarView from './image-mapper-pulsar-view';
import { CompositeDisposable } from 'atom';

export default {

  imageMapperPulsarView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.imageMapperPulsarView = new ImageMapperPulsarView(state.imageMapperPulsarViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.imageMapperPulsarView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'image-mapper-pulsar:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.imageMapperPulsarView.destroy();
  },

  serialize() {
    return {
      imageMapperPulsarViewState: this.imageMapperPulsarView.serialize()
    };
  },

  toggle() {
    console.log('ImageMapperPulsar was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
