import React, { Component } from 'react';
import cx from 'classnames';
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip} from 'recharts';
import { Col, Row, Table } from 'reactstrap';
import moment from 'moment';
import Widget from '../../components/Widget';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';

import s from './Analitycs.module.scss'; // eslint-disable-line

class Analytics extends Component {
  renderPercent(value, prevValue) {
    const percent = ((value / prevValue - 1) * 100).toFixed(2);
    if (percent < 0) {
      return <span className="text-danger">{percent}%</span>
    } else {
      return <span className="text-success">+{percent}%</span>
    }
  }

  getStrokeColor(value, prevValue) {
    const percent = (value / prevValue).toFixed(2);
    if (percent < 1) {
      return "#f55d5d";
    } else {
      return "#68ca66";
    }
  }

  renderTooltip = (props, prefix) => {
    if (props.active) {
      return (
        <div className={`${s.tooltip} bg-dark px-3 rounded`}>
          <h6 className="text-white fw-bold mb-0 mt-0">{prefix}{props.payload[0].value}</h6>
        </div>
      );
    }

    return null;
  }

  render() {
    const cubejsApi = cubejs('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpIjo0MDEzN30.8Slfo_q1LUFAflOoLksmtNxT0MnrwKkf3SX1N6d77Rw');
    return (
      <Row>
        <Col md={12}><h1 className="mb-lg">React E-Commerce Dashboard built with Cube.js</h1></Col>
        <Col md={6}>
          <Row>
            <Col md={6}>

              <QueryRenderer
                query={{
                  "measures": [
                    "Orders.completedCount"
                  ],
                  "timeDimensions": [
                    {
                      "dimension": "Orders.completedAt",
                      "dateRange": [moment().subtract(6, "days").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                      "granularity": "day"
                    }
                  ]
                }}
                cubejsApi={cubejsApi}
                render={({ resultSet }) => {
                  if (!resultSet) {
                    return 'Loading...';
                  }

                  return (
                    <Widget title={ <h5>Completed Orders <small className="text-muted">last 7 days</small> <span className="float-right">{this.renderPercent(resultSet.rawData()[6]["Orders.completedCount"], resultSet.rawData()[5]["Orders.completedCount"])}</span></h5> }>
                      <div className="d-flex align-items-center mt-lg">
                        <h3 className="pr-lg d-flex">Today: <span className="fw-bold ml-sm">{resultSet.rawData()[6]["Orders.completedCount"]}</span></h3>
                        <ResponsiveContainer width="100%" height={50}>
                          <LineChart data={
                            resultSet.rawData().map(item => {
                              item["Orders.completedAt"] = moment(item["Orders.completedAt"]).format('DD-MM')
                              return item;
                          })}>
                            <Tooltip content={this.renderTooltip} />
                            <Line type="monotone" dataKey="Orders.completedCount" stroke={this.getStrokeColor(resultSet.rawData()[6], resultSet.rawData()[5])} strokeWidth="5" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Widget>
                  );
                }}
              />
          </Col>
          <Col md={6}>

              <QueryRenderer
                query={{
                  "measures": [
                    "Orders.completedPercentage"
                  ],
                  "timeDimensions": [
                    {
                      "dimension": "Orders.completedAt",
                      "dateRange": [moment().subtract(6, "days").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                      "granularity": "day"
                    }
                  ]
                }}
                cubejsApi={cubejsApi}
                render={({ resultSet }) => {
                  if (!resultSet) {
                    return 'Loading...';
                  }

                  return (
                    <Widget title={ <h5>Conversion <small className="text-muted">last 7 days</small> <span className="float-right">{this.renderPercent(resultSet.rawData()[6]["Orders.completedPercentage"], resultSet.rawData()[5]["Orders.completedPercentage"])}</span></h5> }>
                      <div className="d-flex align-items-center mt-lg">
                        <h3 className="pr-lg d-flex">Today: <span className="fw-bold ml-sm">{Math.round(resultSet.rawData()[6]["Orders.completedPercentage"]  * 100) / 100}%</span></h3>
                        <ResponsiveContainer width="100%" height={50}>
                          <LineChart data={
                            resultSet.rawData().map(item => {
                              item["Orders.completedAt"] = moment(item["Orders.completedAt"]).format('DD-MM')
                              item["Orders.completedPercentage"] = Math.round(item["Orders.completedPercentage"] * 100) / 100;
                              return item;
                          })}>
                            <Tooltip content={this.renderTooltip} />
                            <Line type="monotone" dataKey="Orders.completedPercentage" stroke={this.getStrokeColor(resultSet.rawData()[6]["Orders.completedPercentage"], resultSet.rawData()[5]["Orders.completedPercentage"])} strokeWidth="5" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Widget>
                  );
                }}
              />
            </Col>
            <Col md={12}>
            <Widget title={ <h5>Total Amount</h5> }>
              <QueryRenderer
                query={{
                  "measures": [
                    "Orders.totalAmount"
                  ],
                  "timeDimensions": [
                    {
                      "dimension": "Orders.completedAt",
                      "dateRange": [moment().subtract(29, "days").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                      "granularity": "day"
                    }
                  ]
                }}
                cubejsApi={cubejsApi}
                render={({ resultSet }) => {
                  if (!resultSet) {
                    return 'Loading...';
                  }

                  return (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={
                        resultSet.rawData().map(item => {
                          item["Orders.completedAt"] = moment(item["Orders.completedAt"]).format('DD-MM')

                          if (!item["Orders.totalAmount"]) {
                            item["Orders.totalAmount"] = 0;
                          }

                          return item;
                      })}>
                        <Tooltip content={(props) => this.renderTooltip(props, '$')} />
                        <XAxis dataKey="Orders.completedAt" axisLine={false}/>
                        <Line type="monotone" dataKey="Orders.totalAmount" stroke="#547fff" strokeWidth="5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  );
                }}
              />
            </Widget>
          </Col>
          </Row>
        </Col>
        <Col md={6}>
          <Widget title="Total Revenue">
            <QueryRenderer
              query={{
                "measures": [
                  "LineItems.totalAmount"
                ],
                "timeDimensions": [
                  {
                    "dimension": "LineItems.createdAt",
                    "dateRange": [moment().subtract(29, "days").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                    "granularity": "day"
                  }
                ]
              }}
              cubejsApi={cubejsApi}
              render={({ resultSet }) => {
                if (!resultSet) {
                  return 'Loading...';
                }

                return (
                  <div>
                    <ResponsiveContainer width="100%" height={445}>
                      <LineChart data={
                        resultSet.rawData().map(item => {
                          item["LineItems.createdAt"] = moment(item["LineItems.createdAt"]).format('DD-MM')
                          return item;
                      })}>
                        <XAxis dataKey="LineItems.createdAt"/>
                        <Tooltip content={(props) => this.renderTooltip(props, '$')} />
                        <Line type="monotone" dataKey="LineItems.totalAmount" stroke="#8884d8" strokeWidth="5" dot={false} />
                      </LineChart>
                     </ResponsiveContainer>
                  </div>
                );
              }}
            />
          </Widget>
        </Col>
        <Col md={12}>
          <QueryRenderer
            query={{
              "dimensions": [
                "Orders.id",
                "ProductCategories.name",
                "LineItems.quantity",
                "LineItems.price",
                "Orders.status"
              ],
              "timeDimensions": [
                {
                  "dimension": "Products.createdAt",
                  "dateRange": [moment().subtract(29, "days").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                  "granularity": null
                }
              ]
            }}
            cubejsApi={cubejsApi}
            render={({ resultSet }) => {
              if (!resultSet) {
                return 'Loading...';
              }

              return (
                <Widget title="Last 10 Orders">
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultSet.rawData().slice(0, 10).reverse().map((item, index) =>
                        <tr key={index}>
                          <th scope="row">{item["Orders.id"]}</th>
                          <td>{item["ProductCategories.name"]}</td>
                          <td>{item["LineItems.quantity"]}</td>
                          <td>${item["LineItems.price"]}.00</td>
                          <td>{item["Orders.status"]}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Widget>
              );
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default Analytics;
