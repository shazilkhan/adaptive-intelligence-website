export default async function handler(req, res) {
  if (req.query.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    let pathsToRevalidate = [];

    // If path is provided in query (for static pages)
    if (req.query.path) {
      pathsToRevalidate.push(req.query.path);
    } 
    // If webhook body contains entry data
    else if (req.body && req.body.entry) {
      const entry = req.body.entry;
      
      // For case studies with slugs
      if (entry.slug) {
        pathsToRevalidate.push(`/case-studies/${entry.slug}`);
        pathsToRevalidate.push('/case-studies'); // Also revalidate listing
      }
    }

    // Special handling: If revalidateAll query param is set, fetch all case study slugs
    if (req.query.revalidateAll === 'case-studies') {
      const { getStrapiApiUrl } = await import('@/utils/strapi');
      const caseStudiesRes = await fetch(
        `${getStrapiApiUrl()}/api/case-studies?fields[0]=slug`
      );
      const caseStudiesJson = await caseStudiesRes.json();
      const allSlugs = caseStudiesJson.data || [];
      
      // Add all case study pages
      allSlugs.forEach(cs => {
        if (cs.slug) {
          pathsToRevalidate.push(`/case-studies/${cs.slug}`);
        }
      });
      
      // Also add the listing page
      pathsToRevalidate.push('/case-studies');
    }

    if (pathsToRevalidate.length === 0) {
      return res.status(400).json({ message: 'No path to revalidate' });
    }

    // Remove duplicates
    pathsToRevalidate = [...new Set(pathsToRevalidate)];

    // Revalidate all paths
    await Promise.all(
      pathsToRevalidate.map(path => res.revalidate(path))
    );
    
    return res.json({ 
      revalidated: true, 
      paths: pathsToRevalidate,
      count: pathsToRevalidate.length
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ message: 'Error revalidating', error: err.message });
  }
}