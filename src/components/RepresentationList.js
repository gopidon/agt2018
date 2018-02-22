/**
 * Created by gopi on 1/16/17.
 */
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {Link, Switch, Route} from 'react-router-dom';
import { List, Button, Spin, Divider, Alert } from 'antd';
//import Loading from '../widgets/Loading';
import {formatDate} from '../utils/date';
import jsPDF from 'jspdf'

class RepresentationList extends React.Component {

    state = {
        loadingMore: false
    }

    render () {
        const {loadingMore, showLoadingMore} = this.state;
        const createSuccess = this.props.match.params.createResult == "success";
        if (this.props.loading) {
            return (<div>Loading...</div>);
        }

        if (this.props.error) {
            console.log(this.props.error);
            return (<div>An unexpected error occurred</div>);
        }
        const reps = this.props.allRepresentations;
        const loadMore = (reps.length < this.props._allRepresentationsMeta.count) ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                {loadingMore && <Spin />}
                {!loadingMore && <Button onClick={this.onLoadMore}>Load More</Button>}
            </div>
        ) : null;
        console.log(this.props)
        return (
            <div>
                {
                    createSuccess?<Alert
                        message="Your representation has been uploaded. Your representation shall be freezed on the last date at 11.59 PM. However, you can modify your options/ grounds of representation before last date."
                        type="success"
                        closable
                        style={{margin: 10}}
                    />:<div/>
                }

                <h3>{`All Representations`}</h3>
                <Divider/>
                <Button type="primary" style={{margin: 10}} onClick={()=> {this.props.history.push("/register")}}>Submit Representation</Button>
                <List
                    bordered
                    loadMore={loadMore}
                    dataSource={reps}
                    renderItem={item => (
                        <List.Item actions={[<Link to={`${this.props.match.url}/show/${item.id}`}>Modify</Link>, <a href="#" onClick={this._genPDF.bind(this, item)}>Download</a>]}>
                            <List.Item.Meta
                                title={<Link to={`${this.props.match.path}/show/${item.id}`}>{`Employee ${item.name}`} submitted on {formatDate(item.createdAt, 'MMMM Do YYYY, h:mm:ss a')}</Link>}
                                description={`Employee Id: ${item.employeeId}`}
                            />
                            {`Last updated on ${formatDate(item.updatedAt, 'MMMM Do YYYY, h:mm:ss a')}`}
                        </List.Item>)}
                />
            </div>
        );
    }

    onLoadMore = () => {
        this.setState({
            loadingMore: true,
        });
        this.props.fetchMore().then((res) => {
            this.setState({
                loadingMore: false,
            });
        });
    }

    _genPDF(item){
        let doc = new jsPDF("p","mm","a4");
        let lMargin=15; //left margin in mm
        let rMargin=15; //right margin in mm
        let pdfInMM=210;  // width of A4 in mm
        let lines;
        let {employeeId, name, batch, designation, dob, currentPosting, option1, option2, option3, option4, option5, grounds, details, createdAt, updatedAt} = item
        dob=formatDate(dob);
        createdAt=formatDate(createdAt);
        updatedAt = formatDate(updatedAt);
        let xStart = 10, yStart=40;
        doc.text(`Representation submitted on ${createdAt}. Last updated on ${updatedAt}`, 10, 20)
        doc.text(`Employee ID: ${employeeId}`, xStart, yStart);
        doc.text(`Batch: ${batch}`, xStart, yStart+10);
        doc.text(`Name: ${name}`, xStart, yStart+20);
        doc.text(`Designation: ${designation}`, xStart, yStart+30);
        doc.text(`Date Of Birth: ${dob}`, xStart, yStart+40);
        doc.text(`Current Posting:`, xStart, yStart+50);
        lines =doc.splitTextToSize(currentPosting, (pdfInMM-lMargin-rMargin));
        doc.text(xStart,yStart+60,lines);
        doc.text(`Option1: ${option1}`, xStart, yStart+90);
        doc.text(`Option2: ${option2}`, xStart, yStart+100);
        doc.text(`Option3: ${option3}`, xStart, yStart+110);
        doc.text(`Option4: ${option4}`, xStart, yStart+120);
        doc.text(`Option5: ${option5}`, xStart, yStart+130);
        doc.text(`Grounds for Representation:`, xStart, yStart+140);
        doc.text(`${grounds}`, xStart, yStart+150);
        doc.text(`Brief details on grounds:`, xStart, yStart+160);
        lines =doc.splitTextToSize(details, (pdfInMM-lMargin-rMargin));
        doc.text(xStart,yStart+170,lines);
        doc.text('Employee Signature', xStart+130, yStart+240)
        //doc.save('Generated.pdf');
        doc.save(`${employeeId}_AGT2018.pdf`)
    }
}

const RepresentationsQuery = gql`
  query Representations ($skip: Int, $first: Int) {
    _allRepresentationsMeta{
      count  
    }
    allRepresentations(skip: $skip, first: $first, orderBy: createdAt_DESC){
      id
      employeeId
      name
      batch
      dob
      designation
      currentPosting
      option1
      option2
      option3
      option4
      option5
      grounds
      details
      createdAt
      updatedAt
    }
  }
`;

const RepresentationListWithData = graphql(RepresentationsQuery, {
    options: (ownProps) => {
        //console.log(ownProps);
        return {
            variables: {
                skip: 0,
                first: 25
            },
            fetchPolicy: 'network-only'
        };
    },
    props: ({ ownProps, data: { loading, allRepresentations, _allRepresentationsMeta, error, refetch, fetchMore } }) => ({
        loading,
        allRepresentations,
        _allRepresentationsMeta,
        error,
        refetch,
        fetchMore: () => fetchMore({
            variables: {
                skip: allRepresentations.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) { return prev; }
                return Object.assign({}, prev, {
                    allRepresentations: [...prev.allRepresentations, ...fetchMoreResult.allRepresentations]
                });
            },
        }),
    })
})(RepresentationList);

export default RepresentationListWithData;




