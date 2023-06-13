import { Component } from "react";

import EventBus from "../../common/EventBus";
import CategoryService from "../../services/category.service";
import { DropdownList } from "react-widgets";
import PropTypes from "prop-types";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.props.onChange.bind(this);

    this.state = {
      category: this.props.category ?? "",
      categories: "",
    };
  }

  componentDidMount() {
    CategoryService.getAll().then(
      (response) => {
        response.data = response.data.filter((category)=> category.type == this.props.type);
        this.setState({
          categories: response.data,
        });
        this.onChange(response.data && response.data[0]);
      },
      (error) => {
        this.setState({
          error:
            (error.response && 
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
      <div>
        {this.state.categories && (
          <DropdownList
            defaultValue={this.state.categories[0].name}
            data={this.state.categories}
            dataKey="id"
            textField="name"
            onChange={(value) => this.onChange(value)}
          />
        )}
      </div>
    );
  }
}
CategoryList.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CategoryList;
