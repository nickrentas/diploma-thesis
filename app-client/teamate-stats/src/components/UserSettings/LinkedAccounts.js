import React, {Component} from 'react';
import {notification, List, Avatar, Button, Skeleton, BackTop, Icon, Modal, Form, Input, Tooltip, Select} from 'antd';
import gql from "graphql-tag";
import {Mutation, Query } from "react-apollo";

const ADD_SUMMONER = gql`
  mutation ($token: String!) {
    addSummoner(token: $token)
  }
`;
const GET_SUMMONERS = gql`
  query ($id: String!){
    getUserInfos(id: $id) {
      summoner {
        name
        server
      }
    }
  }
`;

const SummonerAccounts = (props) => (
    <Query query={GET_SUMMONERS} variables={{id: props.data}}>
      {({ loading, error, data }) => {
        if (loading) return <Skeleton paragraph={{ rows: 4 }} active />
        if (error) return `Error! ${error.message}`;
        console.log(data.getUserInfos);
        return (
            <List
                itemLayout="horizontal"
                dataSource={data.getUserInfos.summoner}
                renderItem={item => (
                    <List.Item actions={[<Button shape="circle" icon="delete" value="summoner name" onClick={e => {
                      console.log(e.target.value)
                    }}/>]}>
                      <List.Item.Meta
                          title="Summoner name"
                          description="server"
                      />
                    </List.Item>
                )}
            />
        );
      }}
    </Query>
);
const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg,
  });
};
const FormItem = Form.Item;
const Option = Select.Option;

class LinkedAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {...props, visible: false}
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
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
    console.log(this.state.data.id)
    return (
        <Mutation mutation={ADD_SUMMONER}>
          {(addSummoner, {data}) => (
              <div>
                <SummonerAccounts data={this.state.data.id}/>
                <Modal
                    title="Add League of Legends Account"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                  <Form layout={'vertical'} onSubmit={e => {
                    e.preventDefault();
                    this.props.form.validateFieldsAndScroll((err, values) => {
                      if (!err) {
                        console.log(values)
                      }
                    });
                  }}>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Summoner Name&nbsp;
                              <Tooltip title="What is you league of legends summoner name?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                        )}
                    >
                      {getFieldDecorator('summoner', {
                        rules: [{required: true, message: 'Please input your summoner name!', whitespace: true}],
                      })(
                          <Input/>
                      )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
              Server&nbsp;
                              <Tooltip title="Which server is the account?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                        )}
                    >
                      {getFieldDecorator('server', {
                        rules: [{required: true, message: 'Please select server game!', whitespace: true}],
                      })(
                          <Select
                              placeholder="Please select server"
                          >
                            <Option value='na'>North America</Option>
                            <Option value='kr'>Republic of korea</Option>
                            <Option value='ru'>Russia</Option>
                            <Option value='br1'>Brazil</Option>
                            <Option value='eun1'>Europe Nordic and East</Option>
                            <Option value='euw1'>Europe West</Option>
                            <Option value='jp1'>Japan</Option>
                            <Option value='la1'>Latin America North</Option>
                            <Option value='la2'>Latin America South</Option>
                            <Option value='oc1'>Ocean</Option>
                            <Option value='tr1'>Turkey</Option>
                          </Select>
                      )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">Add Account</Button>
                    </FormItem>
                  </Form>
                </Modal>
                <BackTop visibilityHeight={-100} onClick={this.showModal}>
                  <div style={addButton}><Icon type="user-add"/></div>
                </BackTop>
              </div>

          )}
        </Mutation>
    )
  }
}

const addButton = {
  height: '40px',
  width: '40px',
  lineHeight: '40px',
  borderRadius: '25px',
  textAlign: 'center'
};
const WrappedAddSummonerForm = Form.create()(LinkedAccounts);
export default WrappedAddSummonerForm
