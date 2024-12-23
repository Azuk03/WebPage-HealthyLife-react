import React, { Component, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import * as actions from "../../../store/actions";
import _ from "lodash";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: null,
      description: '',
      listDoctors: []
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
  }

  buildDataSelectInput = (inputData) => {
    let results = [];
    let {language} = this.props
    if(inputData && inputData.length>0) {
      inputData.map((item,index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`
        let labelEn = `${item.firstName} ${item.lastName}`
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        results.push(object)
      })
    }
    return results;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataSelectInput(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      })
    }
    if(prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataSelectInput(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      })
    }
  }

  // Finish!
  handleEditorChange = ({ html, text }) => {
    this.setState({
        contentMarkdown: text,
        contentHTML: html,
    })
  }

  handleSaveContentMarkdown = () => {
    this.props.saveDetailDoctorAction({
          contentHTML: this.state.contentHTML,
          contentMarkdown: this.state.contentMarkdown,
          description: this.state.description,
          doctorId: this.state.selectedOption.value, 
    })
   
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };

  handleOnChangeDesc = (e) => {
    this.setState({
        description: e.target.value
    })
  }

  render() {
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">Tạo thêm thông tin bác sĩ</div>
        <div className="more-doctor-info">
          <div className="content-left form-group">
            <label>Chọn bác sĩ</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.listDoctors}
            />
          </div>
          <div className="content-right">
          <label>Thông tin giới thiệu: </label>
            <textarea className="form-control" rows="4" onChange={(e) => this.handleOnChangeDesc(e)} value={this.state.description}>
              Nội dung
            </textarea>
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
        </div>
        <button
          className="save-content-doctor"
          onClick={() => this.handleSaveContentMarkdown()}
        >
          Lưu thông tin
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: (id) => dispatch(actions.fetchAllDoctors()),
    saveDetailDoctorAction: (data) => dispatch(actions.saveDetailDoctorAction(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
