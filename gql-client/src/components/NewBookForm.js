/**eslint-enable**/
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import { addAuthorMutation, addBookMutation, getBooksQuery } from '../gql-calls/queries';
import NewBookFormAuthors from './NewBookFormAuthors';

class NewBookForm extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      title: '',
      genre: '',
      authorId: '',
      isNewAuthor: false,
      newAuthorName: '',
    };
    this.changeName = this.changeName.bind(this);
    this.changeId = this.changeId.bind(this);
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

  changeName( val ) {
    this.setState({newAuthorName:val})
  }

  changeId( id ){
    if ( id === 'NEW' ) {
      this.setState(prev => ( { isNewAuthor: true, authorId: '' } ))
    } else {
      this.setState(prev => ( { isNewAuthor: false, newAuthorName: '', authorId: id } ));
    }
  }

  render() {
    return (
      <form id="new-book-form" onSubmit={e => this.handleSubmit( e )}>
        <fieldset>
          <legend>Add Data for a New Book</legend>
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
          <NewBookFormAuthors
            isNewAuthor={this.state.isNewAuthor}
            updateAuthorId={this.changeId}
            updateAuthorName={this.changeName}
          />
          <input type="Submit" />
        </fieldset>
      </form>
    );
  }
}
// export default graphql(getAuthorsQuery)(NewBookForm);
// Use compose to *Bind* **MULTIPLE** gql calls.
export default compose(
  graphql( addAuthorMutation, { name: "addNewAuthorMutation" } ),// {name: "whateverName"} will be used in props
  graphql( addBookMutation, { name: "addNewBookMutation" } ) // No longer props.data....
)( NewBookForm );