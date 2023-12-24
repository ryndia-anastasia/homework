/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.71850731732322, "KoPercent": 1.2814926826767818};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9871850731732322, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9414851424736104, 500, 1500, "Get characters"], "isController": false}, {"data": [0.9998050935550935, 500, 1500, "Delete character"], "isController": false}, {"data": [0.9992222942320156, 500, 1500, "Get characters by ID"], "isController": false}, {"data": [0.99915611814346, 500, 1500, "Change character"], "isController": false}, {"data": [0.9991568296795953, 500, 1500, "Create character"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 78034, 1000, 1.2814926826767818, 4.489799318245852, 0, 256, 1.0, 9.0, 10.0, 12.0, 11073.364552291756, 4920.465379771535, 1955.5664755392365], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get characters", 16389, 959, 5.851485752638965, 18.634083836719665, 0, 256, 11.0, 30.0, 31.0, 187.10000000000036, 2325.6704980842915, 2703.620556619838, 285.67758221583654], "isController": false}, {"data": ["Delete character", 15392, 3, 0.01949064449064449, 0.5446335758835742, 0, 233, 0.0, 1.0, 1.0, 4.0, 2196.9740222666287, 534.2251284613188, 456.9877604910077], "isController": false}, {"data": ["Get characters by ID", 15430, 12, 0.07777057679844458, 0.9875567077122475, 0, 239, 1.0, 1.0, 2.0, 5.0, 2199.258836944128, 551.9624229439852, 272.7596409100627], "isController": false}, {"data": ["Change character", 15405, 13, 0.08438818565400844, 0.6825705939629976, 0, 239, 0.0, 1.0, 2.0, 4.0, 2198.515769944341, 571.0988230519481, 450.8674918831169], "isController": false}, {"data": ["Create character", 15418, 13, 0.08431703204047218, 0.702231158386305, 0, 236, 0.0, 1.0, 1.0, 5.0, 2199.11567536728, 571.2546578590786, 498.23714520039937], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 196 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 181 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 230 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 52 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 49 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 227 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 127 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 245 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 212 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 228 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 130 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 145 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 85 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 112 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 213 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 34 milliseconds, but should not have lasted longer than 30 milliseconds.", 21, 2.1, 0.02691134633621242], "isController": false}, {"data": ["The operation lasted too long: It took 107 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 125 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 131 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 90 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 226 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 35 milliseconds, but should not have lasted longer than 30 milliseconds.", 13, 1.3, 0.016659404874798164], "isController": false}, {"data": ["The operation lasted too long: It took 84 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 143 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 208 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 113 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 162 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 71 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 65 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 144 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 53 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 214 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 48 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.7, 0.008970448778737473], "isController": false}, {"data": ["The operation lasted too long: It took 232 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.7, 0.008970448778737473], "isController": false}, {"data": ["The operation lasted too long: It took 36 milliseconds, but should not have lasted longer than 30 milliseconds.", 17, 1.7, 0.02178537560550529], "isController": false}, {"data": ["The operation lasted too long: It took 244 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 250 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 108 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 114 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 198 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 206 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 330, 33.0, 0.422892585283338], "isController": false}, {"data": ["The operation lasted too long: It took 193 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 40 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.7, 0.008970448778737473], "isController": false}, {"data": ["The operation lasted too long: It took 91 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 242 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 28, 2.8, 0.03588179511494989], "isController": false}, {"data": ["The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 30 milliseconds.", 10, 1.0, 0.01281492682676782], "isController": false}, {"data": ["The operation lasted too long: It took 252 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 249 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 201 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 88 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 216 milliseconds, but should not have lasted longer than 30 milliseconds.", 7, 0.7, 0.008970448778737473], "isController": false}, {"data": ["The operation lasted too long: It took 64 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 225 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 104 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 140 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 152 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 45 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 235 milliseconds, but should not have lasted longer than 30 milliseconds.", 9, 0.9, 0.011533434144091038], "isController": false}, {"data": ["The operation lasted too long: It took 188 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 54, 5.4, 0.06920060486454623], "isController": false}, {"data": ["The operation lasted too long: It took 164 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 38 milliseconds, but should not have lasted longer than 30 milliseconds.", 12, 1.2, 0.015377912192121384], "isController": false}, {"data": ["The operation lasted too long: It took 93 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 171 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 176 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 159 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 74 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 86 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 98 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 62 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 195 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 223 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 211 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 69 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 50 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 147 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 203 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 221 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 43 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 218 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 236 milliseconds, but should not have lasted longer than 30 milliseconds.", 8, 0.8, 0.010251941461414255], "isController": false}, {"data": ["The operation lasted too long: It took 187 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 58 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 190 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 136 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 169 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 120 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 118 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 254 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 237 milliseconds, but should not have lasted longer than 30 milliseconds.", 8, 0.8, 0.010251941461414255], "isController": false}, {"data": ["The operation lasted too long: It took 59 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 240 milliseconds, but should not have lasted longer than 30 milliseconds.", 6, 0.6, 0.007688956096060692], "isController": false}, {"data": ["The operation lasted too long: It took 219 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 222 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 103 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 94 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 172 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 121 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 76 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 101 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 119 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 137 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 78 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 256 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 238 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 185 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 173 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 167 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 192 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 155 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 42 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 77 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 41 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 174 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 191 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 220 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 168 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 200 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 37 milliseconds, but should not have lasted longer than 30 milliseconds.", 17, 1.7, 0.02178537560550529], "isController": false}, {"data": ["The operation lasted too long: It took 215 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 46 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 224 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 239 milliseconds, but should not have lasted longer than 30 milliseconds.", 11, 1.1, 0.014096419509444602], "isController": false}, {"data": ["The operation lasted too long: It took 251 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 73 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 160 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 82 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 139 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 89 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 243 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 234 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 210 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 207 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 97 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 124 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 151 milliseconds, but should not have lasted longer than 30 milliseconds.", 4, 0.4, 0.005125970730707127], "isController": false}, {"data": ["The operation lasted too long: It took 184 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 87 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 158 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 99 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 229 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 75 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 205 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 217 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 63 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 68 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 80 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 165 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 153 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 56 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 177 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 32 milliseconds, but should not have lasted longer than 30 milliseconds.", 120, 12.0, 0.15377912192121382], "isController": false}, {"data": ["The operation lasted too long: It took 44 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 182 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, 0.2, 0.0025629853653535636], "isController": false}, {"data": ["The operation lasted too long: It took 253 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, 0.5, 0.00640746341338391], "isController": false}, {"data": ["The operation lasted too long: It took 117 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 92 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, 0.3, 0.003844478048030346], "isController": false}, {"data": ["The operation lasted too long: It took 105 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}, {"data": ["The operation lasted too long: It took 39 milliseconds, but should not have lasted longer than 30 milliseconds.", 9, 0.9, 0.011533434144091038], "isController": false}, {"data": ["The operation lasted too long: It took 241 milliseconds, but should not have lasted longer than 30 milliseconds.", 6, 0.6, 0.007688956096060692], "isController": false}, {"data": ["The operation lasted too long: It took 189 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, 0.1, 0.0012814926826767818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 78034, 1000, "The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 330, "The operation lasted too long: It took 32 milliseconds, but should not have lasted longer than 30 milliseconds.", 120, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 54, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 28, "The operation lasted too long: It took 34 milliseconds, but should not have lasted longer than 30 milliseconds.", 21], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get characters", 16389, 959, "The operation lasted too long: It took 31 milliseconds, but should not have lasted longer than 30 milliseconds.", 330, "The operation lasted too long: It took 32 milliseconds, but should not have lasted longer than 30 milliseconds.", 120, "The operation lasted too long: It took 33 milliseconds, but should not have lasted longer than 30 milliseconds.", 54, "Non HTTP response code: java.net.BindException/Non HTTP response message: Can't assign requested address", 28, "The operation lasted too long: It took 34 milliseconds, but should not have lasted longer than 30 milliseconds.", 21], "isController": false}, {"data": ["Delete character", 15392, 3, "The operation lasted too long: It took 228 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 214 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["Get characters by ID", 15430, 12, "The operation lasted too long: It took 239 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, "The operation lasted too long: It took 237 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 236 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 235 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 215 milliseconds, but should not have lasted longer than 30 milliseconds.", 1], "isController": false}, {"data": ["Change character", 15405, 13, "The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 30 milliseconds.", 5, "The operation lasted too long: It took 237 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 235 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 239 milliseconds, but should not have lasted longer than 30 milliseconds.", 1, "The operation lasted too long: It took 228 milliseconds, but should not have lasted longer than 30 milliseconds.", 1], "isController": false}, {"data": ["Create character", 15418, 13, "The operation lasted too long: It took 234 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, "The operation lasted too long: It took 233 milliseconds, but should not have lasted longer than 30 milliseconds.", 3, "The operation lasted too long: It took 232 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 235 milliseconds, but should not have lasted longer than 30 milliseconds.", 2, "The operation lasted too long: It took 236 milliseconds, but should not have lasted longer than 30 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
