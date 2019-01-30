/**eslint-enable**/
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../gql-calls/queries';

class NewBookForm extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      title: '',
      genre: '',
      authorId: '',
      isNewAuthor: false,
      newAuthorName: '',
      name: '',
    };
  }

  handleSubmit( e ) {
    e.preventDefault();
    this.props.addNewBookMutation( {
      variables: {
        name: this.state.title,
        genre: this.state.genre,
        authorId: this.state.authorId
      },
      refetchQueries: [{ query: getBooksQuery }]
    } );
  }

  handleAuthorsChange( e ) {
    const val = e.target.value
    if ( e.target.value === 'new' )
    {
      this.setState( prev => ( { isNewAuthor: true, authorId: '' } ) );
    } else
    {
      this.setState( prev => ( { isNewAuthor: false, newAuthorName: '', authorId: val } ) );
    }
  }
  renderAuthorsDropdown() {
    const data = this.props.getAuthorsListQuery;
    if ( data.loading ) return ( <option disabled>Loading Authors...</option> );
    return (
      <>
        <label htmlFor="author">Author: </label>
        <select
          id="author"
          required
          onChange={e => this.handleAuthorsChange( e )}
          className="add-book__form--author-select add-book__form-field"
        >
          <option value="">--Choose Author--</option>
          {data.authors.map( auth => (
            <option value={auth.id} key={auth.id}> {auth.name} </option>
          ) )}
          <option value="new" required>--Add New Author--</option>
        </select>
      </>
    );
  }

  render() {
    return (
      <form id="new-book-form" onSubmit={e => this.handleSubmit( e )}>
        <fieldset>
          <legend>Add New Book Data</legend>
          <div className="add-book__title add-book__form-field">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              required
              onChange={e => this.setState( { title: e.target.value } )}
            />
          </div>
          <div className="add-book__genre add-book__form-field">
            <label htmlFor="genre">Genre: </label>
            <input
              type="text"
              id="genre"
              onChange={e => this.setState( { genre: e.target.value } )}
            />
          </div>
          <div className="add-book__author add-book__form-field">{this.renderAuthorsDropdown()}</div>
          {/* {this.state.isNewAuthor && (
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
          )} */}
          <input type="Submit" />
        </fieldset>
      </form>
    );
  }
}
// export default graphql(getAuthorsQuery)(NewBookForm);
// Use compose to *Bind* **MULTIPLE** gql calls.
export default compose(
  graphql( getAuthorsQuery, { name: "getAuthorsListQuery" } ),// {"Names"} will be used in props
  graphql( addBookMutation, { name: "addNewBookMutation" } ) // No longer props.data....
)( NewBookForm );