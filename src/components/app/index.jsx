import React from 'react';
import { Container, Button, Grid, Header, Icon, Image, Item, List, Segment } from 'semantic-ui-react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import 'semantic-ui-css/semantic.min.css';

import config from '../../config';

const { CLOUDINARY_API_URI, UPLOAD_FLYER_PRESET } = config;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { files: {}, filesUrl: {} };
    autoBind(this);
    console.log(process.env);
  }

  onImageDrop(files) {
    this.setState({ files });
  }

  handleImageUpload() {
    request.post(`${CLOUDINARY_API_URI}/upload`)
      .field('upload_preset', UPLOAD_FLYER_PRESET)
      .field('file', this.state.files)
      .end((err, response) => {
        if (err) {
          console.error(err);
        }

        if (response.body.secure_url !== '') {
          this.setState({ filesUrl: response.body.secure_url });
        }
      });
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
            <label>There is no images yet.</label>
          </Item.Content>
        </Item>
      );
    } else {
      return files.map((file) =>
        <Item>
          <Item.Image name="name" size="tiny" src={file.preview} />
          <Item.Content>
            <label>{file.name}</label>
            <Button>delete</Button>
          </Item.Content>
        </Item>
      );
    }
  }

  renderImageUrlList() {
    return (
      <List.Item>{}</List.Item>
    );
  }

  render() {
    const { files, filesUrl } = this.state;
    const hasFile = !!files.length;

    return (
      <Grid divided className="App">
        <Grid.Row>
          <Header as="h1">Image Upload Page</Header>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width={2}>
          <Header as="h3">Drop Zone</Header>
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
        <Grid.Column width={6}>
          <Header as="h3">Selected Images</Header>
          <Item.Group>{this.renderSelectedImages()}</Item.Group>
          <Button
            inverted
            color="orange"
            onClick={this.handleImageUpload}
          >
            Upload
          </Button>
        </Grid.Column>
        <Grid.Column width={8}>
          <Header as="h3" color="orange">Uploaded Images</Header>
          <List>
            <List.Item>Apples</List.Item>
            <List.Item>Pears</List.Item>
            <List.Item>Oranges</List.Item>
          </List>
          <Button
            inverted
            color="red"
          >
            Erase
          </Button>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
