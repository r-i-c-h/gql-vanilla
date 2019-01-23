import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getAuthorsQuery } from '../gql-calls/queries';

class NewBookForm extends Component {
  state = {
    title: '',
    genre: '',
    authorId: '',
    isNewAuthor: false,
    newAuthorName: ''
  };

  handleSubmit(e) {
    e.preventDefault();
    // this.props.addNewBook(this.state)
  }

  handleAuthorsChange(e) {
    if (e.target.value === 'new') {
      this.setState({ isNewAuthor: true, authorId:'' });
    } else {
      this.setState({ authorId: e.target.value });
    }
  }
  renderAuthorsDropdown() {
    var data = this.props.data;
    if (data.loading) return null;
    return (
      <>
        <label htmlFor="author">Author: </label>
        <select
          id="author"
          required
          onChange={e => this.handleAuthorsChange(e)}
          className="add-book__form--author-select add-book__form-field"
        >
          <option value="">--Choose Author--</option>
          {this.props.data.authors.map(auth => (
            <option value={auth.id} key={auth.id}> {auth.name} </option>
          ))}
          <option value="new">--Add New Author--</option>
        </select>
      </>
    );
  }

  render() {
    return (
      <form id="new-book-form" onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Add New Book Data</legend>
          <div className="add-book__title add-book__form-field">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              required
              onChange={e => this.setState({ title: e.target.value })}
            />
          </div>
          <div className="add-book__genre add-book__form-field">
            <label htmlFor="genre">Genre: </label>
            <input
              type="text"
              id="genre"
              onChange={e => this.setState({ genre: e.target.value })}
            />
          </div>
          <div className="add-book__author add-book__form-field">{this.renderAuthorsDropdown()}</div>
          {this.state.isNewAuthor && (
            <div className="add-book__author--new add-book__form-field">
              <label htmlFor="newAuth">New Author Name: </label>
              <input
                type="text"
                id="newAuthorName"
                required
                onChange={e =>
                  this.setState({ newAuthorName: e.target.value })
                }
              />
            </div>
          )}
          <input type="Submit" onSubmit={e => this.handleSubmit(e)} />
        </fieldset>
      </form>
    );
  }
}
export default graphql(getAuthorsQuery)(NewBookForm);
