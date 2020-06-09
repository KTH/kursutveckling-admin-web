import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Row, Col, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FaCheck } from 'react-icons/fa';

//Components

//Helpers
import i18n from '../../../../i18n/index';

@inject([ 'archiveStore' ])
@observer
class ArchivePage extends Component {
	toggleSelected = (id) => {
		this.props.archiveStore.toggleSelectedArchiveFragment(id);
	};

	downloadArchivePackage = () => {
		this.props.archiveStore.downloadArchivePackage(this.props.archiveStore.selectedArchiveFragments);
	};

	render() {
		const { archiveStore } = this.props;
		const translate = i18n.messages[archiveStore.language].messages;
		return (
			<Container>
				<Row>
					<Col>
						<h1>Archive</h1>
					</Col>
				</Row>
				<Row>
					<Form>
						<Col>
							<FormGroup className="form-check">
								<Input
									type="checkbox"
									id="checkbox"
									checked={!archiveStore.hideExported}
									onChange={() => archiveStore.toggleHideExported()}
								/>
								<Label for="checkbox">Show Exported</Label>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup className="form-date">
								<Label for="checkbox">From Date</Label>
								<Input
									type="date"
									id="fromDate"
									value={archiveStore.fromDate}
									onChange={(event) => {
										archiveStore.fromDate = event.target.value;
									}}
								/>
								<Label for="checkbox">To Date</Label>
								<Input
									type="date"
									id="toDate"
									value={archiveStore.toDate}
									onChange={(event) => {
										archiveStore.toDate = event.target.value;
									}}
								/>
							</FormGroup>
						</Col>
					</Form>
				</Row>
				<Row>
					<Col>
						<Table className="archive-page-table">
							<thead>
								<tr>
									<th>Include</th>
									<th>Course Code</th>
									<th>Course Offering</th>
									<th>Published Date</th>
									{archiveStore.hideExported ? null : <th>Exported</th>}
								</tr>
							</thead>
							<tbody>
								{archiveStore.filteredArchiveFragments.map((archiveFragment) => (
									<tr key={archiveFragment.courseCode + '-' + archiveFragment.courseRound}>
										<td>
											<input
												type="checkbox"
												onChange={() => this.toggleSelected(archiveFragment._id)}
												checked={archiveStore.isSelectedArchiveFragment(archiveFragment._id)}
											/>
										</td>
										<td>{archiveFragment.courseCode}</td>
										<td>{archiveFragment.courseRound}</td>
										<td>
											{archiveFragment.attachments[0] ? (
												new Date(
													archiveFragment.attachments[0].publishedDate
												).toLocaleDateString('sv-SE')
											) : null}
										</td>
										{archiveStore.hideExported ? null : !!archiveFragment.exported ? (
											<td>
												<FaCheck />
											</td>
										) : (
											<td />
										)}
									</tr>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
				<Row className="py-4">
					<Col>
						<Button
							disabled={archiveStore.selectedArchiveFragments.length === 0}
							onClick={this.downloadArchivePackage}
						>
							Create Archive Package
						</Button>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default ArchivePage;
