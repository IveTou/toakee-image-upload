import React from 'react';
import { Container, Button, Grid, Header, Icon, Image, Item, List } from 'semantic-ui-react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import 'semantic-ui-css/semantic.min.css';

import config from '../../config';

const { CLOUDINARY_API_URI, UPLOAD_FLYER_PRESET } = config;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { files: '', filesUrl: '' };
    autoBind(this);
    console.log(process.env.BROWSER);
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

  render() {
    const { files, filesUrl } = this.state;
    const hasFile = !!files.length;

    return (
      <Grid divided className="App">
        <Grid.Row>
          <Header as="h1">Image Upload Page</Header>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width={4}>
          <Header as="h3">Drop Zone</Header>
          <Dropzone
            className="DropZone"
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop}
          >
            <div>
              <Icon name='upload' size='huge' color="blue" />
              <p>Drop files here or click to upload</p>
            </div>
          </Dropzone>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as="h3">Selected Images</Header>
          <Item.Group>

            <Item>
              <Item.Image name="name" size="tiny" src="https://react.semantic-ui.com/assets/images/wireframe/image.png" />
              <Item.Content>
                <p>Description</p>
                <Button>delete</Button>
              </Item.Content>
            </Item>

          </Item.Group>
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
