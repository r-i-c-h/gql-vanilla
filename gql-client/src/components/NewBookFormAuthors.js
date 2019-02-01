import React, {Component} from 'react';
import { graphql } from 'react-apollo'
import { getAuthorsQuery } from '../gql-calls/queries';

class NewBookFormAuthors extends Component {
  handleSelectChange(e){
    let val = e.target.value
    this.props.updateAuthorId( val );
  }

  renderSelectBoxOptions() {
    if ( this.props.loading || !this.props.data.authors) {
      return ( <option disabled value="">Loading...</option> )
    } else {
      let authors = this.props.data.authors;
      return (
        authors.map( author => {
          return ( <option key={author.id} value={author.id}>{author.name}</option> )
        })
        .concat( <option key={123} value="NEW">--Add NEW Author--</option> )
      )
    }
  }

  renderNewAuthorInput() {
    return (
      <div className="add-book__author--new add-book__form-field">
        <label htmlFor="newName">New Author's Name: </label>
        <input
          type="text"
          id="newName"
          required
          onChange={e => this.props.updateAuthorName( e.target.value )}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="add-book__author--select add-book__form-field">
        <select
          id="author"
          onChange={e => { this.handleSelectChange(e) }}
        >
          <option value={null}>--Please Select--</option>
          {this.renderSelectBoxOptions()}
        </select>
        {this.props.isNewAuthor && this.renderNewAuthorInput()}
      </div>
    )
  }
}
export default graphql( getAuthorsQuery )( NewBookFormAuthors );