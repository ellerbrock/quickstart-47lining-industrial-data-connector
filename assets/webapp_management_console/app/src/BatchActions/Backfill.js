import React, { Component } from 'react'
import pluralize from 'pluralize'
import { Formik } from 'formik'
import { Button, Form, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import _ from 'lodash'

import Client from '../ApiClient.js'
import { getPayloadFromProps } from './utils.js'

import QueryOrDatepickers from './components/QueryOrDatepickers.js'


class Backfill extends Component {

    render() {
        const { feeds } = this.props;
        const totalCount = feeds ? feeds.length : this.props.feedsTotalCount;
        return (
            <div>
                <p>You are going to backfill {totalCount} {pluralize('feed', totalCount)}</p>
                {totalCount > 100 && <p>This operation can take a long time!</p>}
                <hr />
                <Formik
                    initialValues={{
                        name: 'backfill',
                        syntax: false,
                        to: '',
                        from: '',
                        query: ''
                    }}
                    validate={values => {
                        let errors = {};
                        if (values.name === '') {
                            errors.name = 'Required';
                        }
                        if (!((values.syntax && values.query !== '') || (!values.syntax && values.to !== '' && values.from !== ''))) {
                            errors.syntax = 'Query or from and to required'
                        }
                        return errors;
                    }}
                    onSubmit={
                        values => {
                            let payload = {...getPayloadFromProps(this.props), ...values}
                            Client.backfillFeeds(payload);
                            this.props.onSubmitCallback();
                        }
                    }
                    render={props => (
                        <Form
                            onSubmit={props.handleSubmit}
                            horizontal
                        >
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        name="name"
                                        value={props.values.name}
                                        onChange={props.handleChange}
                                    />
                                </Col>
                            </FormGroup>
                            <QueryOrDatepickers
                                syntax={props.values.syntax}
                                to={props.values.to}
                                from={props.values.from}
                                query={props.values.query}
                                setFieldValue={props.setFieldValue}
                                onChange={props.handleChange}
                            />
                            <Button
                                className="btn-primary"
                                onClick={props.handleSubmit}
                                disabled={!_.isEmpty(props.errors) || !props.dirty}
                            >
                                Continue
                            </Button>
                        </Form>
                    )}
                />
            </div>
        )
    }
}

export default Backfill;
