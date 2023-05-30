import { Cluster } from '../models/board.model';

const clusterWidth = 300;
const clusterHeight = 300;
const clusterMargin = 10;
const navWidth = 70;

export function arrangeClusters(clusters: Cluster[]): void {
  const offsetY = 100; // avoid board header overlap
  const offsetX = 40; // avoid board header overlap
  const availableWidth = document.documentElement.offsetWidth - navWidth;
  const clustersPerRow = Math.floor(
    availableWidth / (clusterWidth + clusterMargin)
  );

  clusters.forEach((cluster, index) => {
    cluster.position.x =
      Math.floor(index % clustersPerRow) * (clusterWidth + clusterMargin) +
      clusterMargin +
      offsetX;
    cluster.position.y =
      Math.floor(index / clustersPerRow) * (clusterHeight + clusterMargin) +
      clusterMargin +
      offsetY;
  });
}
