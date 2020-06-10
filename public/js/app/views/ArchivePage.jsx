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
						<h1>Skapa arkivpaket av publicerade kursanalyser</h1>
					</Col>
				</Row>
				<Row>
          <Col lg="9">
            <p>
              På denna sida laddar du ner en ZIP-fil som innehåller publicerade kursanalyser som ska bevaras i e-arkivet genom ett manuellt handhavande. ZIP-filen innehåller förutom valda kursanalyser filen sip.xml som specificerar ZIP-filens innehåll med metadata. Som exempel innehåller sip.xml uppgifter om vilken kursomgång kursanalysen publicerats för, vilken tidpunkt den publicerats m.m.
            </p>
            <p>
              Välj de publicerade kursanalyser som du vill ta ut för att bevara i e-arkivet och klicka på knappen &rdquo;Skapa arkivpaket&rdquo;. Systemet kommer då att skapa en ZIP-fil med valda kursanalyser och specifikationen sip.xml. Ladda ned ZIP-filen och extrahera för att hantera ZIP-filens innehåll.
            </p>
          </Col>
          <Col lg="3">
            <div className="roundArchiveFilter">
              <FormGroup className="form-check">
                <Input
                  type="checkbox"
                  id="checkbox"
                  checked={!archiveStore.hideExported}
                  onChange={() => archiveStore.toggleHideExported()}
                />
                <Label for="checkbox">Visa exporterade</Label>
              </FormGroup>
              <FormGroup className="form-date">
                <h4>Kursanalysens publiceringsdatum</h4>
                <Label for="checkbox">Från datum</Label>
                <Input
                  type="date"
                  id="fromDate"
                  value={archiveStore.fromDate}
                  onChange={(event) => {
                    archiveStore.fromDate = event.target.value;
                  }}
                />
                <Label for="checkbox">Till datum</Label>
                <Input
                  type="date"
                  id="toDate"
                  value={archiveStore.toDate}
                  onChange={(event) => {
                    archiveStore.toDate = event.target.value;
                  }}
                />
              </FormGroup>
            </div>
          </Col>
				</Row>
				<Row>
					<Col>
						<Table className="archive-page-table">
							<thead>
								<tr>
									<th>Inkludera i arkivpaket</th>
									<th>Kurskod</th>
									<th>Kursomgång</th>
									<th>Kursanalysens publiceringsdatum</th>
									{archiveStore.hideExported ? null : <th>Exporterad</th>}
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
				<Row className="py-2">
					<Col>
						<Button
							disabled={archiveStore.selectedArchiveFragments.length === 0}
							onClick={this.downloadArchivePackage}
						>
							Skapa arkivpaket
						</Button>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default ArchivePage;
