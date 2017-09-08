import React from 'react';
import { Button, Grid, Header, Icon, Input, Item, List, Loader, Segment } from 'semantic-ui-react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { includes } from 'lodash';

import config from '../../config';

require('./style.css');

const { CLOUDINARY_API_URI, UPLOAD_FLYER_PRESET } = config;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { files: {}, filesUrl: {}, loading: {}, target: '' };
    autoBind(this);
  }

  onInputChange(e, { value }) {
    this.setState({ target: value });
  }

  onImageDrop(files) {
    this.setState({ files: [...this.state.files, ...files] });
  }

  onDeletePreview(file) {
    this.setState({ files: this.state.files.filter(e => { return e !== file })});
  }

  onErase(){
    this.setState({files: {}, filesUrl: {}})
  }

  handleImageUpload() {
    const { files, target } = this.state;

    for(const i in files) {
      this.setState({ loading: [...this.state.loading, files[i]] });
      console.log(files[i]);
      request.post(`${CLOUDINARY_API_URI}/upload`)
        .field('upload_preset', UPLOAD_FLYER_PRESET)
        .field('file', files[i])
        .field('public_id', `${target}/${files[i].name.substr(0, files[i].name.lastIndexOf('.'))}`)
        .end((err, response) => {
          if (err) {
            console.error(err);
          }

          if (response.body.secure_url !== '') {
            this.setState({ filesUrl: [...this.state.filesUrl, response.body.secure_url] });
            this.setState({ loading: this.state.loading.filter(e => { return e !== files[i] }) });
          }
        });
    }
  }

  renderSelectedImages() {
    const { files } = this.state;

    if (!!!files.length) {
      return (
        <Item>
          <Item.Image
            name="name"
            size="tiny"
            src="https://react.semantic-ui.com/assets/images/wireframe/image.png"
          />
          <Item.Content>
            <label>There are no images yet.</label>
          </Item.Content>
        </Item>
      );
    } else {
      return files.map((file) =>
        <Item>
          <Item.Image name="name" size="tiny" src={file.preview} />
          <Loader active disabled={!includes(this.state.loading, file)} />
          <Item.Content>
            <div className="name">{file.name}</div>
            <Button className="delete" onClick={() => this.onDeletePreview(file)}>delete</Button>
          </Item.Content>
        </Item>
      );
    }
  }

  renderImageUrlList() {
    const { filesUrl } = this.state;

    if (!!!filesUrl.length) {
      return <List.Item>There are no files uploaded yet.</List.Item>
    } else {
      return filesUrl.map((url) =>
        <List.Item className="name">{url}</List.Item>
      );
    }
  }

  render() {
    const { files, filesUrl } = this.state;
    const hasFile = !!files.length;

    return (
      <Grid divided columns={3} relaxed className="App">
        <Grid.Row>
          <Header as="h1">Image Upload Page</Header>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column className="drop">
          <Header as="h3">Drop Zone</Header>
          <p>
            On this area you should insert files by drag an dop or click and select them.
            It is possible to select a bunch os files or insert them one by one.
          </p>
          <Input placeholder='ID do Evento' onChange={this.onInputChange} />
          <Segment>
            <Dropzone
              className="DropZone"
              multiple={true}
              accept="image/*"
              onDrop={this.onImageDrop}
            >
              <div>
                <Icon name='upload' size='huge' color="blue" />
                <p>Drop files here or click to upload</p>
              </div>
            </Dropzone>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Header as="h3">Selected Images</Header>
          <p>
            On this area is showed the selected file to upload. Before upload it you can also
            delete some of them. To upload, click on "Upload" button.
          </p>
          <Item.Group>{this.renderSelectedImages()}</Item.Group>
            <Button
              inverted
              color="orange"
              onClick={this.handleImageUpload}
            >
              Upload
            </Button>
        </Grid.Column>
        <Grid.Column>
          <Header as="h3" color="orange">Uploaded Images</Header>
          <p>
            On this area you can see the uploaded image files by their cloudinary URL. For reset
            the sistem and start again click on "Erase" to clean all data.
          </p>
          <List>{this.renderImageUrlList()}</List>
          <Button inverted color="red" onClick={this.onErase}>Erase</Button>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
