import React from 'react';
import $ from 'jquery';
import Certificate from './Certificate';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo'
import moment from 'moment';
import { Link, withRouter} from 'react-router-dom';
import { Form, Input, InputNumber, DatePicker,  Icon, Select,  Button, Upload, message } from 'antd';
const {TextArea} = Input
const FormItem = Form.Item;
const Option = Select.Option;

class EditRepresentation extends React.Component {
    constructor(props){
        super(props);
        const {medical, disability, spouse, child, other} = props.representation;
        //console.log(medical, disability, spouse, child, other)
        this.state =
        {
            medicalCertificateList: [],
            disabilityCertificateList: [],
            spouseEmploymentCertificateList: [],
            childAcademicCertificateList: [],
            otherCertificateList: [],
            uploadingMedicalCertificate: false,
            uploadingDisabilityCertificate: false,
            uploadingSpouseEmploymentCertificate: false,
            uploadingChildAcademicCertificate: false,
            uploadingOtherCertificate: false,
            medicalCertificateFile: medical || null,
            disabilityCertificateFile: disability || null,
            spouseEmploymentCertificateFile: spouse || null,
            childAcademicCertificateFile: child || null,
            otherCertificateFile: other || null
        }

    }
    _populateBatches(){
        let batches = [];
        for(let i=1982; i < 2018; i++){
            batches.push(<Option key={i} value={i}>{i}</Option>)
        }
        return batches
    }

    _populateDesignations(){
        let designations = ['Principal Chief Commissioner', 'Chief Commissioner', 'Principal Commissioner', 'Commissioner', 'Additional Commissioner', 'Joint Commissioner', 'Deputy Commissioner', 'Assistant Commissioner'];
        let options = [];
        for(let i of designations){
            options.push(<Option key={i} value={i}>{i}</Option>)
        }
        return options;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let self = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {employeeId, batch, name, designation, dob, currentPosting, option1, option2, option3, option4, option5, grounds, details } = values;
                const {medicalCertificateFile, disabilityCertificateFile, spouseEmploymentCertificateFile, childAcademicCertificateFile, otherCertificateFile} = this.state;
                //console.log(contentHTML, number, year, date, taxType, issuedBy);
                let variables = {id: this.props.representation.id, employeeId, batch, name, designation, dob, currentPosting, option1, option2, option3, option4, option5, grounds, details}
                if(medicalCertificateFile){
                    variables['medicalId'] = medicalCertificateFile.id
                }
                if(disabilityCertificateFile){
                    variables['disabilityId'] = disabilityCertificateFile.id
                }
                if(spouseEmploymentCertificateFile){
                    variables['spouseId'] = spouseEmploymentCertificateFile.id
                }
                if(childAcademicCertificateFile){
                    variables['childId'] = childAcademicCertificateFile.id
                }
                if(otherCertificateFile){
                    variables['otherId'] = otherCertificateFile.id
                }
                console.log("Variables:", variables);
                this.props.mutate({variables})
                    .then((res) => {
                        console.log("Created Representation", res.data);
                        message.success("Your representation has been updated. Your representation shall be frozen on the last date at 11.59 PM. However, you can modify your options/ grounds of representation before last date", 10)
                        self.props.history.push("/reps")
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error(`Something went wrong while saving your representation: ${err}`, 5)
                    })
            }
        });
    }

    render(){
        //console.log(this.state);
        let self = this;
        const dateFormat = 'DD-MM-YYYY';
        const rep = this.props.representation;
        const { getFieldDecorator } = this.props.form;
        const { uploadingMedicalCertificate, uploadingDisabilityCertificate, uploadingSpouseEmploymentCertificate, uploadingChildAcademicCertificate, uploadingOtherCertificate } = this.state;

        const medicalCertificateProps = {
            action: 'https://api.graph.cool/file/v1/cjdvts85z2ff701755ezv6ewd',
            onRemove: (file) => {
                this.setState(({ medicalCertificateList }) => {
                    return {
                        medicalCertificateList: [],
                    };
                });
            },
            beforeUpload: (file) => {
                console.log("File:", file)
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                    message.error('You can only upload a PDF file!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    message.error('File size must be smaller than 5MB!');
                }
                if(isPDF && isLt5M){
                    this.setState(({medicalCertificateList}) => ({
                        medicalCertificateList: [file]
                    }));
                }
                return false;
            },
            fileList: this.state.medicalCertificateList,
        };

        const disabilityCertificateProps = {
            action: 'https://api.graph.cool/file/v1/cjdvts85z2ff701755ezv6ewd',
            onRemove: (file) => {
                this.setState(({ disabilityCertificateList }) => {
                    return {
                        disabilityCertificateList: [],
                    };
                });
            },
            beforeUpload: (file) => {
                console.log("File:", file)
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                    message.error('You can only upload a PDF file!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    message.error('File size must be smaller than 5MB!');
                }
                if(isPDF && isLt5M){
                    this.setState(({disabilityCertificateList}) => ({
                        disabilityCertificateList: [file]
                    }));
                }
                return false;
            },
            fileList: this.state.disabilityCertificateList,
        };

        const spouseEmploymentCertificateProps = {
            action: 'https://api.graph.cool/file/v1/cjdvts85z2ff701755ezv6ewd',
            onRemove: (file) => {
                this.setState(({ spouseEmploymentCertificateList }) => {
                    return {
                        spouseEmploymentCertificateList: [],
                    };
                });
            },
            beforeUpload: (file) => {
                console.log("File:", file)
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                    message.error('You can only upload a PDF file!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    message.error('File size must be smaller than 5MB!');
                }
                if(isPDF && isLt5M){
                    this.setState(({spouseEmploymentCertificateList}) => ({
                        spouseEmploymentCertificateList: [file]
                    }));
                }
                return false;
            },
            fileList: this.state.spouseEmploymentCertificateList,
        };

        const childAcademicCertificateProps = {
            action: 'https://api.graph.cool/file/v1/cjdvts85z2ff701755ezv6ewd',
            onRemove: (file) => {
                this.setState(({ childAcademicCertificateList }) => {
                    return {
                        childAcademicCertificateList: [],
                    };
                });
            },
            beforeUpload: (file) => {
                console.log("File:", file)
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                    message.error('You can only upload a PDF file!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    message.error('File size must be smaller than 5MB!');
                }
                if(isPDF && isLt5M){
                    this.setState(({childAcademicCertificateList}) => ({
                        childAcademicCertificateList: [file]
                    }));
                }
                return false;
            },
            fileList: this.state.childAcademicCertificateList,
        };

        const otherCertificateProps = {
            action: 'https://api.graph.cool/file/v1/cjdvts85z2ff701755ezv6ewd',
            onRemove: (file) => {
                this.setState(({ otherCertificateList }) => {
                    return {
                        otherCertificateList: [],
                    };
                });
            },
            beforeUpload: (file) => {
                console.log("File:", file);
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                    message.error('You can only upload a PDF file!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    message.error('File size must be smaller than 5MB!');
                }
                if(isPDF && isLt5M){
                    this.setState(({otherCertificateList}) => ({
                        otherCertificateList: [file]
                    }));
                }
                return false;
            },
            fileList: this.state.otherCertificateList,
        };

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="Employee ID"
                >
                    {getFieldDecorator('employeeId', {
                        rules: [{
                            type: 'integer', message: 'The input is not a valid Employee ID',
                        },{
                            required: true, message: 'Please enter your Employee ID',
                        }],
                        initialValue: rep.employeeId
                    }, )(
                        <InputNumber disabled min={1} max={10000} step={1}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Batch"
                >
                    {getFieldDecorator('batch', {
                        rules: [{
                            required: true, message: 'Please enter your batch',
                        }],
                        initialValue: rep.batch
                    })(
                        <Select
                        >
                            {
                                this._populateBatches()
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Name"
                    extra="(100 characters)"
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: 'Please enter your Name',
                        },
                            {
                                max: 100, message: 'Name cannot be more than 100 characters!',
                            }],
                        initialValue: rep.name
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Designation"
                >
                    {getFieldDecorator('designation', {
                        rules: [{
                            required: true, message: 'Please select your Designation',
                        }],
                        initialValue: rep.designation
                    })(
                        <Select
                        >
                            {
                                this._populateDesignations()
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Date Of Birth"
                >
                    {getFieldDecorator('dob', {
                        rules: [{ type: 'object', required: true, message: 'Please select your Date Of Birth' }],
                        initialValue: moment(rep.dob)
                    })(
                        <DatePicker format={dateFormat}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Current Posting"
                    extra="(200 characters)"
                >
                    {getFieldDecorator('currentPosting', {
                        rules: [{ required: true, message: 'Please enter the details about your current posting!' },
                            {
                                max: 200, message: 'Current posting details cannot be more than 200 characters!',
                            }],
                        initialValue: rep.currentPosting
                    })(
                        <TextArea rows={4}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Option 1"
                    extra="(100 characters)"
                >
                    {getFieldDecorator('option1', {
                        rules: [{
                            required: true, message: 'Please enter Option 1',
                        },
                            {
                                max: 100, message: 'Option cannot be more than 100 characters!',
                            }],
                        initialValue: rep.option1
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Option 2"
                    extra="(100 characters)"
                >
                    {getFieldDecorator('option2', {
                        rules: [
                            {
                                max: 100, message: 'Option cannot be more than 100 characters!',
                            }],
                        initialValue: rep.option2
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Option 3"
                    extra="(100 characters)"
                >
                    {getFieldDecorator('option3', {
                        rules: [
                            {
                                max: 100, message: 'Option cannot be more than 100 characters!',
                            }],
                        initialValue: rep.option3
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Option 4"
                    extra="(100 characters)"
                >
                    {getFieldDecorator('option4', {
                        rules: [
                            {
                                max: 100, message: 'Option cannot be more than 100 characters!',
                            }],
                        initialValue: rep.option4
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Option 5"
                    extra="(100 characters)"
                >
                    {getFieldDecorator('option5', {
                        rules: [
                            {
                                max: 100, message: 'Option cannot be more than 100 characters!',
                            }],
                            initialValue: rep.option5
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Grounds for Representation"
                    extra="You can choose multiple grounds"
                >
                    {getFieldDecorator('grounds', {
                        rules: [
                            { required: true, message: 'Please select the grounds for representation', type: 'array' },
                        ],
                        initialValue: rep.grounds
                    })(
                        <Select mode="multiple" placeholder="Please select the grounds for representation">
                            <Option value="Due list">Due list</Option>
                            <Option value="Medical Grounds of Self">Medical Grounds of Self</Option>
                            <Option value="Person with Disabilities">Person with Disabilities</Option>
                            <Option value="Spouse Grounds">Spouse Grounds</Option>
                            <Option value="Child in 10th or 12th in Current Academic Year">Child in 10th or 12th in Current Academic Year</Option>
                            <Option value="Less than 3 years of Retirement from 2018-19">Less than 3 years of Retirement from 2018-19</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Brief details of grounds"
                    extra="(500 characters)"
                >
                    {getFieldDecorator('details', {
                        rules: [
                            {
                                max: 500, message: 'Details of grounds cannot be more than 500 characters!',
                            }]
                    })(
                        <TextArea rows={5}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Upload Medical Certificate"
                    extra="Cerificate must be in PDF format not exceeding 5 MB in size"
                >
                    <Upload {...medicalCertificateProps}>
                        <Button>
                            <Icon type="upload" /> Select File
                        </Button>
                    </Upload>
                    {
                        this.state.medicalCertificateFile? <Certificate file={this.state.medicalCertificateFile} onFileDelete={()=> {this.setState({medicalCertificateFile: null})}}/>:
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload.bind(this,"medical")}
                                disabled={this.state.medicalCertificateList.length === 0}
                                loading={uploadingMedicalCertificate}
                            >
                                {uploadingMedicalCertificate ? 'Uploading' : 'Start Upload' }
                            </Button>
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Upload Disability Certificate"
                    extra="Cerificate must be in PDF format not exceeding 5 MB in size"
                >
                    <Upload {...disabilityCertificateProps}>
                        <Button>
                            <Icon type="upload" /> Select File
                        </Button>
                    </Upload>
                    {
                        this.state.disabilityCertificateFile? <Certificate file={this.state.disabilityCertificateFile} onFileDelete={()=> {this.setState({disabilityCertificateFile: null})}}/>:
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload.bind(this, "disability")}
                                disabled={this.state.disabilityCertificateList.length === 0}
                                loading={uploadingDisabilityCertificate}
                            >
                                {uploadingDisabilityCertificate ? 'Uploading' : 'Start Upload' }
                            </Button>
                    }

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Upload Spouse Employment Certificate"
                    extra="Cerificate must be in PDF format not exceeding 5 MB in size"
                >
                    <Upload {...spouseEmploymentCertificateProps}>
                        <Button>
                            <Icon type="upload" /> Select File
                        </Button>
                    </Upload>
                    {
                        this.state.spouseEmploymentCertificateFile? <Certificate file={this.state.spouseEmploymentCertificateFile} onFileDelete={()=> {this.setState({spouseEmploymentCertificateFile: null})}}/>:
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload.bind(this, "spouse")}
                                disabled={this.state.spouseEmploymentCertificateList.length === 0}
                                loading={uploadingSpouseEmploymentCertificate}
                            >
                                {uploadingSpouseEmploymentCertificate ? 'Uploading' : 'Start Upload' }
                            </Button>
                    }

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Upload Child Academic Certificate"
                    extra="Cerificate must be in PDF format not exceeding 5 MB in size"
                >
                    <Upload {...childAcademicCertificateProps}>
                        <Button>
                            <Icon type="upload" /> Select File
                        </Button>
                    </Upload>
                    {
                        this.state.childAcademicCertificateFile? <Certificate file={this.state.childAcademicCertificateFile} onFileDelete={()=> {this.setState({childAcademicCertificateFile: null})}}/>:
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload.bind(this, "child")}
                                disabled={this.state.childAcademicCertificateList.length === 0}
                                loading={uploadingChildAcademicCertificate}
                            >
                                {uploadingChildAcademicCertificate ? 'Uploading' : 'Start Upload' }
                            </Button>
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Other Certificate"
                    extra="Cerificate must be in PDF format not exceeding 5 MB in size"
                >
                    <Upload {...otherCertificateProps}>
                        <Button>
                            <Icon type="upload" /> Select File
                        </Button>
                    </Upload>
                    {
                        this.state.otherCertificateFile? <Certificate file={this.state.otherCertificateFile} onFileDelete={()=> {this.setState({otherCertificateFile: null})}}/>:
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload.bind(this, "other")}
                                disabled={this.state.otherCertificateList.length === 0}
                                loading={uploadingOtherCertificate}
                            >
                                {uploadingOtherCertificate ? 'Uploading' : 'Start Upload' }
                            </Button>

                    }
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="danger" style={{marginRight: 10}} >
                        <Link to={`/reps`}>
                            Cancel
                        </Link>
                    </Button>
                    <Button type="primary" htmlType="submit">Save</Button>
                </FormItem>
            </Form>
        )
    }
    handleUpload = (type) => {
        let file, uploading, certificate;
        switch (type){
            case "medical":
                uploading = "uploadingMedicalCertificate";
                file = this.state.medicalCertificateList[0];
                certificate = "medicalCertificateFile"
                break;
            case "disability":
                uploading = "uploadingDisabilityCertificate"
                file = this.state.disabilityCertificateList[0];
                certificate = "disabilityCertificateFile"
                break;
            case "spouse":
                uploading = "uploadingSpouseEmploymentCertificate";
                file = this.state.spouseEmploymentCertificateList[0];
                certificate = "spouseEmploymentCertificateFile"
                break;
            case "child":
                uploading = "uploadingChildAcademicCertificate";
                file = this.state.childAcademicCertificateList[0];
                certificate = "childAcademicCertificateFile"
                break;
            case "other":
                uploading = "uploadingOtherCertificate";
                file = this.state.otherCertificateList[0];
                certificate = "otherCertificateFile"
                break;
        }
        const fd = new FormData();
        fd.append('data', file);
        let self = this;
        this.setState({
            [uploading]: true,
        });

        // You can use any AJAX library you like
        var fileName = file.name; //Should be 'picture.jpg'
        $.ajax({
            url: "https://api.graph.cool/file/v1/cjdvts85z2ff701755ezv6ewd",
            data: fd,
            type: 'POST',
            // THIS MUST BE DONE FOR FILE UPLOADING
            contentType: false,
            processData: false,
            // ... Other options like success and etc
            success: function(data){
                console.log("UPLOAD SUCCESS:", data);
                let file = JSON.parse(data);
                let fileId = file.id;
                self.setState({
                    [certificate]: file,
                    [uploading]: false,
                });
            },
            error: function(data){
                console.log("UPLOAD ERRRRRR:",data)
                self.setState({
                    [uploading]: false,
                });
            }
        })
    }
}

const updateRepresentationMutation = gql`
  mutation updateRepresentation($id: ID!, $employeeId: Int!, $batch: Int!, $name: String!, $designation: String!, $dob: DateTime!, $currentPosting: String!, 
                    $option1: String!, $option2: String,$option3: String,$option4: String,$option5: String,$grounds: [String!]!, $details: String, 
                    $medicalId: ID, $disabilityId: ID, $spouseId: ID, $childId: ID, $otherId: ID){
    updateRepresentation(id: $id, employeeId: $employeeId, batch: $batch, name: $name, designation: $designation, dob: $dob, currentPosting: $currentPosting, 
                    option1:$option1, option2:$option2, option3:$option3, option4:$option4, option5: $option5, grounds: $grounds, details: $details, 
                    medicalId: $medicalId, disabilityId: $disabilityId, spouseId: $spouseId, childId: $childId, otherId: $otherId) {
      id
    }
  }
`

const WrappedRegistrationForm = Form.create()(EditRepresentation);

export default graphql(updateRepresentationMutation)(withRouter(WrappedRegistrationForm))