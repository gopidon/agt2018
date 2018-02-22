import React from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import EditRepresentation from './EditRepresentation.js';

class RepresentationPage extends React.Component {


    render () {
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.data.error) {
            console.log(this.props.data.error)
            return (<div>An unexpected error occurred</div>)
        }

        const representation = this.props.data.Representation
        //console.log(representation)

        return (
            <div>
                <EditRepresentation
                    representation={representation}
                />
            </div>
        )
    }

}

const RepresentationQuery = gql`query Representation($id: ID!) {
    Representation(id: $id) {
      id
      employeeId
      name
      batch
      designation
      currentPosting
      dob
      option1
      option2
      option3
      option4
      option5
      grounds
      details
      medical{
        id
        name
        url
      }
      disability{
        id
        name
        url
      }
      spouse{
        id
        name
        url
      }
      child{
        id
        name
        url
      }
      other{
        id
        name
        url
      }
    }
  }
`

const RepresentationPageWithData = graphql(RepresentationQuery, {
        options: (ownProps) => ({
            variables: {
                id: ownProps.match.params.representationId
            },
            fetchPolicy: 'network-only'
        })
    }
)(RepresentationPage)

export default RepresentationPageWithData

