import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
    Table,
    TableHeader,
    TableBody,
    expandable
} from '@patternfly/react-table';

import { statusSummary, normalizeStatus } from './statusHelper';

const RemediationActivityTable = ({ remediation, playbookRuns }) => {

    const [rows, setRows] = useState([]);

    const systemsStatus = { running: 1, success: 2, failure: 1 };

    const handleOnCollapse = (event, rowId, isOpen) => {
        const collapseRows = [...rows];
        collapseRows[rowId] = { ...collapseRows[rowId], isOpen };
        setRows(collapseRows);
    };

    const columns = [
        'Run on',
        'Run by',
        'Status'
    ];

    useEffect(() => {
        if (playbookRuns && playbookRuns.length) {
            setRows(playbookRuns.reduce((acc, playbooks, i) => (
                [
                    ...acc,
                    {
                        isOpen: false,
                        cells: [
                            { title: <Link to={ `/${remediation.id}/${playbooks.id}` }> { playbooks.created_at } </Link>,
                                cellFormatters: [ expandable ]},
                            `${playbooks.created_by.first_name} ${playbooks.created_by.last_name}`,
                            { title: statusSummary(normalizeStatus(playbooks.status), systemsStatus) }
                        ]
                    }, {
                        parent: 2 * i,
                        fullWidth: true,
                        cells: [{
                            title: <Table
                                aria-label="Compact expandable table"
                                cells={ [ 'Connection', 'Systems', 'Playbook runs status' ] }
                                rows={ playbooks.executors.map(e => (
                                    { cells: [
                                        { title: <Link to={ `/${remediation.id}/${playbooks.id}/${e.executor_id}` }>{ e.executor_name }</Link> },
                                        e.system_count,
                                        { title: statusSummary(normalizeStatus(playbooks.status), systemsStatus)}
                                    ]}
                                )) }
                            >
                                <TableHeader />
                                <TableBody />
                            </Table>
                        }]
                    }
                ]
            ), []))
        }
    });
    
    return (
        <Table aria-label="Collapsible table" onCollapse={ handleOnCollapse } rows={rows} cells={columns}>
            <TableHeader />
            <TableBody />
        </Table>
    );
}

RemediationActivityTable.propTypes = {
    remediation: PropTypes.object,
    playbookRuns: PropTypes.object
};

export default RemediationActivityTable;
