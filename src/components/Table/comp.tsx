import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { fetchData } from "../../service/fetchData";
import Overlay from "../Overlay/comp";
import LoadingScreen from "../LoadingScreen/comp";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

//Declaring a gobal array to maintain the selection and deSelion of multiple rows across pages

const pageSelection: { page: number; rows: number[] }[] = [];

export default function Table() {
  const [art, serArt] = useState<Artwork[]>([]);
  const [selectArt, setSelectArt] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currPage, setCurrPage] = useState<number>(0);

  const totalRecords = 10528;
  const rlimit = 12;

  // Function to updadte or add page with respective selected row indicies in the pageSelection array

  const updatePageData = (
    page: number,
    newInd: number[],
    deSel: boolean = false
  ) => {
    const pageData = pageSelection.find((p) => p.page === page);

    if (pageData) {
      if (deSel) {
        // Remove deSeled ind from the page
        pageData.rows = pageData.rows.filter(
          (index) => !newInd.includes(index)
        );
      } else {
        // Add selected ind, ensuring no duplicates which enhances the code efficiency
        pageData.rows = Array.from(new Set([...pageData.rows, ...newInd]));
      }

      // Remove the page entry if no rows remain selected which enhances the code efficiency
      if (pageData.rows.length === 0) {
        const pageIndex = pageSelection.findIndex((p) => p.page === page);
        pageSelection.splice(pageIndex, 1);
      }
    } else if (!deSel) {
      // Add a new entry for the page if no entry exists
      pageSelection.push({ page, rows: newInd });
    }
  };

  // Function to sync selectArt with the current page's pageSelection

  const syncSelectArt = (page: number, data: Artwork[]) => {
    const pageData = pageSelection.find((p) => p.page === page);

    if (pageData) {
      // Filter the current page's data to only include selected rows
      const selectedRows = data.filter((_, index) =>
        pageData.rows.includes(index)
      );
      setSelectArt(selectedRows);
    } else {
      // Clear the selected rows if there are no selections for the current page
      setSelectArt([]);
    }
  };

  //Function to Load data for the specified page

  const loadData = async (page: number) => {
    setLoading(true);
    const data = await fetchData(page, rlimit);

    if (data) {
      serArt(data);
      syncSelectArt(page, data);
    } else {
      serArt([]);
      setSelectArt([]);
    }

    setLoading(false);
  };

  //Function to handle page change in the DataTable
  const onPage = (
    event: import("primereact/datatable").DataTableStateEvent
  ) => {
    const page = event.page ?? 0;
    setCurrPage(page); // Update the current page state
    loadData(page + 1); // Load data for the new page
  };

  // Function to handle changes in row selection

  const handleSelectionChange = (e: { value: Artwork[] }) => {
    const selectedRows = e.value;
    const currPageind = selectedRows.map((row) => art.indexOf(row));

    const deSeledRows = selectArt.filter((row) => !selectedRows.includes(row));
    const deSeledind = deSeledRows.map((row) => art.indexOf(row));

    // Update pageSelection for selected and deSeled rows
    updatePageData(currPage + 1, currPageind);
    updatePageData(currPage + 1, deSeledind, true);

    setSelectArt(selectedRows);
    // console.log("Updated Global Page Selection:", pageSelection);
  };

  // Function to handle selection via the Overlay component

  const handleOverlay = async (rowCount: number) => {
    let rem = rowCount;
    let currPageInd = currPage + 1;

    while (rem > 0) {
      const remRows = Math.min(rlimit, rem); // Rows to select on the current page
      const ind = Array.from({ length: remRows }, (_, i) => i);

      updatePageData(currPageInd, ind);

      if (currPageInd === currPage + 1) {
        const selectedRows = art.filter((_, index) => ind.includes(index));
        setSelectArt(selectedRows);
      }

      rem -= remRows;
      currPageInd++;
    }

    console.log("Updated pageSelection Array:", pageSelection);
  };

  // Load data for the first page on component mount

  useEffect(() => {
    loadData(1);
  }, []);

  // Custom header for the Title column, including the Overlay component
  const titleHeader = (
    <div
      className="align-items-center justify-content-between"
      style={{ display: "inline-flex" }}
    >
      <Overlay onSubmit={handleOverlay} />
      <span style={{ marginLeft: "8px" }}>Title</span>
    </div>
  );

  return (
    <>
      {/* logic to show Loading Screen when the DataTable is loading  */}
      {loading && <LoadingScreen message={`Loading Page ${currPage + 1}...`} />}

      {!loading && (
        <div className="card">
          <DataTable
            value={art}
            selectionMode="multiple"
            selection={selectArt}
            onSelectionChange={handleSelectionChange}
            dataKey="id"
            lazy
            paginator
            rows={rlimit}
            totalRecords={totalRecords}
            loading={loading}
            onPage={onPage}
            first={currPage * rlimit}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "5rem" }}
            ></Column>
            <Column field="title" header={titleHeader}></Column>
            <Column field="place_of_origin" header="Place of Origin"></Column>
            <Column field="artist_display" header="Artist Display"></Column>
            <Column field="inscriptions" header="Inscriptions"></Column>
            <Column field="date_start" header="Date Start"></Column>
            <Column field="date_end" header="Date End"></Column>
          </DataTable>
        </div>
      )}
    </>
  );
}
