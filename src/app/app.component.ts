import { Component, NgZone, OnInit, AfterViewInit } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../environments/environment';

am4core.useTheme(am4themes_animated);

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit, OnInit {

  map : mapboxgl.Map;
  style="mapbox://styles/mapbox/streets-v11";
  lat=37.75;
  lng=-122.41;

  constructor(private zone: NgZone) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    this.map=new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 2,
      center: [-120,50],
    });
    this.map.addControl(new mapboxgl.NavigationControl());
   
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.getGaugeChart();
      this.getPie1();
      this.getPie2();
      this.getMap();
    });
  }

  getGaugeChart() {
    let chart = am4core.create("chartGauge", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    /**
     * Normal axis
     */

    let axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    //axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 40;
    axis.renderer.labels.template.fill = am4core.color("white");
    axis.renderer.labels.template.adapter.add("text", function(text) {
      return text;
    });

    /**
     * Axis for ranges
     */

    let colorSet = new am4core.ColorSet();

    let axis2 = chart.xAxes.push(new am4charts.ValueAxis());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 10;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);

    let range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    /**
     * Label
     */

    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 45;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = "50%";
    label.fill = am4core.color("white");

    /**
     * Hand
     */

    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 50;
    hand.fill = am4core.color("white");

    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(0);
      axis2.invalidate();
    });

    setInterval(function() {
      let value = Math.round(Math.random() * 100);
      let animation = new am4core.Animation(
        hand,
        {
          property: "value",
          to: value
        },
        1000,
        am4core.ease.cubicOut
      ).start();
    }, 2000);
  }

  getPie1() {
    let chart = am4core.create("chartPie1", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    //chart.legend = new am4charts.Legend();

    chart.data = [
      {
        country: "Lithuania",
        litres: 501.9
      },
      {
        country: "Czech Republic",
        litres: 301.9
      },
      {
        country: "Ireland",
        litres: 201.1
      },
      {
        country: "Germany",
        litres: 165.8
      }
    ];

    
    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "litres";
    series.dataFields.category = "country";
    series.ticks.template.disabled = true;
    series.alignLabels = false;
    series.labels.template.text = `{value.percent.formatNumber('#.0')}%`;
    series.labels.template.radius = am4core.percent(-40);
    series.labels.template.fill = am4core.color('white');
  }

  getPie2() {
    let chart = am4core.create("chartPie2", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    //chart.legend = new am4charts.Legend();

    chart.data = [
      {
        country: "Lithuania",
        litres: 501.9
      },
      {
        country: "Czech Republic",
        litres: 30.9
      }
    ];

    
    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "litres";
    series.dataFields.category = "country";
    series.ticks.template.disabled = true;
    series.alignLabels = false;
    series.labels.template.text = `{value.percent.formatNumber('#.0')}%`;
    series.labels.template.radius = am4core.percent(-40);
    series.labels.template.fill = am4core.color('white');
  }

  getMap() {

  }

}
