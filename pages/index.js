import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Container, Table } from "@mantine/core"
import { useEffect, useState } from "react"
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid"

export default function Home() {
	const [countryData, setCountryData] = useState([])
	const [ascending, setAscending] = useState(false)
	const [ascendingPop, setAscendingPop] = useState(true)

	async function fetchData() {
		try {
			const response = await fetch(`https://restcountries.com/v3.1/all`)
			const data = await response.json()
			await data.map((country) => {
				setCountryData((prev) => {
					return [
						...prev,
						{
							name: country.name.common,
							capital: country.capital,
							population: country.population.toLocaleString("en-US"),
							flag: country.flag,
							continent: country.continents,
						},
					].sort((a, d) => {
						if (a.name.toUpperCase() < d.name.toUpperCase()) {
							return -1
						}
						if (a.name.toUpperCase() > d.name.toUpperCase()) {
							return 1
						}
						return 0
					})
				})
			})
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	function sortAlphabetical() {
		if (ascending) {
			let sorted = countryData.sort((a, d) => {
				if (a.name.toUpperCase() < d.name.toUpperCase()) {
					return -1
				}
				if (a.name.toUpperCase() > d.name.toUpperCase()) {
					return 1
				}
				return 0
			})
			setAscending(false)
			setCountryData([...sorted])
		}
		if (!ascending) {
			let sorted = countryData.sort((a, d) => {
				if (a.name.toUpperCase() < d.name.toUpperCase()) {
					return 1
				}
				if (a.name.toUpperCase() > d.name.toUpperCase()) {
					return -1
				}
				return 0
			})
			setAscending(true)
			setCountryData([...sorted])
		}
	}

	function sortPopulation() {
		if (ascendingPop) {
			let sorted = countryData.sort((a, b) => {
				return (
					Number(a.population.split(",").join("")) -
					Number(b.population.split(",").join(""))
				)
			})
			setAscendingPop(false)
			setCountryData([...sorted])
		}
		if (!ascendingPop) {
			let sorted = countryData.sort((a, b) => {
				return (
					Number(b.population.split(",").join("")) -
					Number(a.population.split(",").join(""))
				)
			})
			setAscendingPop(true)
			setCountryData([...sorted])
		}
	}

	return (
		<Container style={{ marginTop: "5rem" }}>
			<Table
				horizontalSpacing="md"
				verticalSpacing="md"
				fontSize="md"
				striped
				highlightOnHover
			>
				<thead>
					<tr>
						<th>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "1rem",
								}}
							>
								<span>Country</span>
								<div onClick={sortAlphabetical}>
									{ascending ? (
										<SortAscendingIcon height={25} width={25} />
									) : (
										<SortDescendingIcon height={25} width={25} />
									)}
								</div>
							</div>
						</th>
						<th>Capital</th>
						<th>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "1rem",
								}}
							>
								<span>Population</span>
								<div onClick={sortPopulation}>
									{ascendingPop ? (
										<SortAscendingIcon height={25} width={25} />
									) : (
										<SortDescendingIcon height={25} width={25} />
									)}
								</div>
							</div>
						</th>
						<th>Flag</th>
						<th>Continent</th>
					</tr>
				</thead>
				<tbody>
					{countryData &&
						countryData.map((country) => (
							<tr key={Math.floor(Math.random() * 999999)}>
								<td>{country.name}</td>
								<td>{country.capital}</td>
								<td>{country.population}</td>
								<td>{country.flag}</td>
								<td>{country.continent}</td>
							</tr>
						))}
				</tbody>
			</Table>
		</Container>
	)
}
