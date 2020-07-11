import "@patternfly/react-core/dist/styles/base.css";

import * as React from "react";
import {
  Button,
  ButtonVariant,
  Bullseye,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarFilter,
  ToolbarToggleGroup,
  ToolbarGroup,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  InputGroup,
  Title,
  Select,
  SelectOption,
  SelectVariant,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  TextInput,
} from "@patternfly/react-core";
import { SearchIcon, FilterIcon } from "@patternfly/react-icons";
import { Table, TableHeader, TableBody } from "@patternfly/react-table";

class FilterTableDemo extends React.Component<any, any> {
  private onDelete: any;
  private onCategoryToggle: any;
  private onCategorySelect: any;
  private onFilterToggle: any;
  private onFilterSelect: any;
  private onInputChange: any;
  private onStatusSelect: any;
  private onNameInput: any;
  private onLocationSelect: any;

  constructor(props: any) {
    super(props);

    this.state = {
      filters: {
        location: [],
        name: [],
        status: [],
      },
      currentCategory: "Location",
      isFilterDropdownOpen: false,
      isCategoryDropdownOpen: false,
      nameInput: "",
      columns: [
        { title: "ID" },
        { title: "Category" },
        { title: "Title" },
        { title: "Tags" },
        { title: "Estimate" },
        { title: "Require" },
        { title: "Link" },
        { title: "Runs" },
      ],
      rows: [],
      inputValue: "",
    };

    this.onDelete = (type: any = "", id: any = "") => {
      if (type) {
        this.setState((prevState: any) => {
          prevState.filters[type.toLowerCase()] = prevState.filters[
            type.toLowerCase()
          ].filter((s: any) => s !== id);
          return {
            filters: prevState.filters,
          };
        });
      } else {
        this.setState({
          filters: {
            location: [],
            name: [],
            status: [],
          },
        });
      }
    };

    this.onCategoryToggle = (isOpen: any) => {
      this.setState({
        isCategoryDropdownOpen: isOpen,
      });
    };

    this.onCategorySelect = (event: any) => {
      this.setState({
        currentCategory: event.target.innerText,
        isCategoryDropdownOpen: !this.state.isCategoryDropdownOpen,
      });
    };

    this.onFilterToggle = (isOpen: any) => {
      this.setState({
        isFilterDropdownOpen: isOpen,
      });
    };

    this.onFilterSelect = (event: any) => {
      this.setState({
        isFilterDropdownOpen: !this.state.isFilterDropdownOpen,
      });
    };

    this.onInputChange = (newValue: any) => {
      this.setState({ inputValue: newValue });
    };

    this.onStatusSelect = (event: any, selection: any) => {
      const checked = event.target.checked;
      this.setState((prevState: any) => {
        const prevSelections = prevState.filters["status"];
        return {
          filters: {
            ...prevState.filters,
            status: checked
              ? [...prevSelections, selection]
              : prevSelections.filter((value: any) => value !== selection),
          },
        };
      });
    };

    this.onNameInput = (event: any) => {
      if (event.key && event.key !== "Enter") {
        return;
      }

      const { inputValue } = this.state;
      this.setState((prevState: any) => {
        const prevFilters = prevState.filters["name"];
        return {
          filters: {
            ...prevState.filters,
            // eslint-disable-next-line
            ["name"]: prevFilters.includes(inputValue)
              ? prevFilters
              : [...prevFilters, inputValue],
          },
          inputValue: "",
        };
      });
    };

    this.onLocationSelect = (event: any, selection: any) => {
      this.setState((prevState: any) => {
        return {
          filters: {
            ...prevState.filters,
            // eslint-disable-next-line
            ["location"]: [selection],
          },
        };
      });
      this.onFilterSelect();
    };
  }

  async loadTests() {
    const tests: any[] = [];

    const data = tests.map((t) => ({
      cells: [
        t.ID,
        t.Category,
        t.Title,
        t.Tags.join(" "),
        t.Estimate,
        t.Require.join(" "),
        t.Link,
        t.Runs,
      ],
    }));

    this.setState({ rows: data });
  }

  buildCategoryDropdown() {
    const { isCategoryDropdownOpen, currentCategory } = this.state;

    return (
      <ToolbarItem>
        <Dropdown
          onSelect={this.onCategorySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.onCategoryToggle}
              style={{ width: "100%" }}
            >
              <FilterIcon /> {currentCategory}
            </DropdownToggle>
          }
          isOpen={isCategoryDropdownOpen}
          dropdownItems={[
            <DropdownItem key="cat1">Location</DropdownItem>,
            <DropdownItem key="cat2">Name</DropdownItem>,
            <DropdownItem key="cat3">Status</DropdownItem>,
          ]}
          style={{ width: "100%" }}
        ></Dropdown>
      </ToolbarItem>
    );
  }

  buildFilterDropdown() {
    const {
      currentCategory,
      isFilterDropdownOpen,
      inputValue,
      filters,
    } = this.state;

    const locationMenuItems = [
      <SelectOption key="raleigh" value="Raleigh" />,
      <SelectOption key="westford" value="Westford" />,
      <SelectOption key="boston" value="Boston" />,
      <SelectOption key="brno" value="Brno" />,
      <SelectOption key="bangalore" value="Bangalore" />,
    ];

    const statusMenuItems = [
      <SelectOption key="statusRunning" value="Running" />,
      <SelectOption key="statusStopped" value="Stopped" />,
      <SelectOption key="statusDown" value="Down" />,
      <SelectOption key="statusDegraded" value="Degraded" />,
      <SelectOption key="statusMaint" value="Needs Maintainence" />,
    ];

    return (
      <React.Fragment>
        <ToolbarFilter
          chips={filters.location}
          deleteChip={this.onDelete}
          categoryName="Location"
          showToolbarItem={currentCategory === "Location"}
        >
          <Select
            aria-label="Location"
            onToggle={this.onFilterToggle}
            onSelect={this.onLocationSelect}
            selections={filters.location[0]}
            isOpen={isFilterDropdownOpen}
            placeholderText="Any"
          >
            {locationMenuItems}
          </Select>
        </ToolbarFilter>
        <ToolbarFilter
          chips={filters.name}
          deleteChip={this.onDelete}
          categoryName="Name"
          showToolbarItem={currentCategory === "Name"}
        >
          <InputGroup>
            <TextInput
              name="nameInput"
              id="nameInput1"
              type="search"
              aria-label="name filter"
              onChange={this.onInputChange}
              value={inputValue}
              placeholder="Filter by name..."
              onKeyDown={this.onNameInput}
            />
            <Button
              variant={ButtonVariant.control}
              aria-label="search button for search input"
              onClick={this.onNameInput}
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        </ToolbarFilter>
        <ToolbarFilter
          chips={filters.status}
          deleteChip={this.onDelete}
          categoryName="Status"
          showToolbarItem={currentCategory === "Status"}
        >
          <Select
            variant={SelectVariant.checkbox}
            aria-label="Status"
            onToggle={this.onFilterToggle}
            onSelect={this.onStatusSelect}
            selections={filters.status}
            isOpen={isFilterDropdownOpen}
            placeholderText="Filter by status"
          >
            {statusMenuItems}
          </Select>
        </ToolbarFilter>
      </React.Fragment>
    );
  }

  renderToolbar() {
    // eslint-disable-next-line
    const { filters } = this.state;
    return (
      <Toolbar
        id="toolbar-with-chip-groups"
        clearAllFilters={this.onDelete}
        collapseListedFiltersBreakpoint="xl"
      >
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
            <ToolbarGroup variant="filter-group">
              {this.buildCategoryDropdown()}
              {this.buildFilterDropdown()}
            </ToolbarGroup>
          </ToolbarToggleGroup>
        </ToolbarContent>
      </Toolbar>
    );
  }

  render() {
    const { loading, rows, columns, filters } = this.state;

    const filteredRows =
      filters.name.length > 0 ||
      filters.location.length > 0 ||
      filters.status.length > 0
        ? rows.filter((row: any) => {
            return (
              (filters.name.length === 0 ||
                filters.name.some((name: any) =>
                  row.cells[0].toLowerCase().includes(name.toLowerCase())
                )) &&
              (filters.location.length === 0 ||
                filters.location.includes(row.cells[5])) &&
              (filters.status.length === 0 ||
                filters.status.includes(row.cells[4]))
            );
          })
        : rows;

    return (
      <React.Fragment>
        {this.renderToolbar()}
        {!loading && filteredRows.length > 0 && (
          <Table
            cells={columns}
            rows={filteredRows}
            // onSelect={this.onRowSelect}
            aria-label="Test Cases"
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {!loading && filteredRows.length === 0 && (
          <React.Fragment>
            <Table
              cells={columns}
              rows={filteredRows}
              // onSelect={this.onRowSelect}
              aria-label="Test Cases"
            >
              <TableHeader />
              <TableBody />
            </Table>
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h5" size="lg">
                  No results found
                </Title>
                <EmptyStateBody>
                  No results match this filter criteria. Remove all filters or
                  clear all filters to show results.
                </EmptyStateBody>
                <EmptyStateSecondaryActions>
                  <Button variant="link" onClick={() => this.onDelete(null)}>
                    Clear all filters
                  </Button>
                </EmptyStateSecondaryActions>
              </EmptyState>
            </Bullseye>
          </React.Fragment>
        )}
        {loading && (
          <Title headingLevel="h2" size="3xl">
            Please wait while loading data
          </Title>
        )}
      </React.Fragment>
    );
  }
}

export default FilterTableDemo;
